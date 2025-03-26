using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SqlServerAppLock
{
    public class SqlServerAppLockTools
    {
        private readonly string _connectionString;

        public SqlServerAppLockTools(string connectionString)
        {
            _connectionString = connectionString;
        }

        public bool TryAcquireLock(string resourceName, string lockId, TimeSpan timeout)
        {
            using var connection = new SqlConnection(_connectionString);
            connection.Open();

            using var transaction = connection.BeginTransaction(IsolationLevel.Serializable);
            try
            {
                // 清理过期锁
                var cleanupCommand = new SqlCommand(
                    "DELETE FROM DistributedLocks WHERE ExpiryTime < GETUTCDATE()",
                    connection,
                    transaction);
                cleanupCommand.ExecuteNonQuery();

                // 尝试获取锁
                var acquireCommand = new SqlCommand(@"
                IF NOT EXISTS (
                    SELECT 1 FROM DistributedLocks 
                    WHERE ResourceName = @ResourceName
                )
                BEGIN
                    INSERT INTO DistributedLocks (ResourceName, LockId, ExpiryTime)
                    VALUES (@ResourceName, @LockId, @ExpiryTime)
                END",
                    connection,
                    transaction);

                acquireCommand.Parameters.AddWithValue("@ResourceName", resourceName);
                acquireCommand.Parameters.AddWithValue("@LockId", lockId);
                acquireCommand.Parameters.AddWithValue("@ExpiryTime", DateTime.UtcNow.Add(timeout));

                int affectedRows = acquireCommand.ExecuteNonQuery();
                transaction.Commit();

                return affectedRows > 0;
            }
            catch (SqlException ex) when (ex.Number == 2627)  // 主键冲突（锁已存在）
            {
                transaction.Rollback();
                return false;
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        public bool ReleaseLock(string resourceName, string lockId)
        {
            using var connection = new SqlConnection(_connectionString);
            connection.Open();

            var command = new SqlCommand(@"
            DELETE FROM DistributedLocks 
            WHERE ResourceName = @ResourceName 
                AND LockId = @LockId",
                connection);

            command.Parameters.AddWithValue("@ResourceName", resourceName);
            command.Parameters.AddWithValue("@LockId", lockId);

            return command.ExecuteNonQuery() > 0;
        }

        // 带自动续期的锁获取（可选）
        public bool TryAcquireLockWithRetry(string resourceName, string lockId,
            TimeSpan timeout, int maxRetries = 3)
        {
            for (int i = 0; i < maxRetries; i++)
            {
                if (TryAcquireLock(resourceName, lockId, timeout))
                {
                    return true;
                }
                System.Threading.Thread.Sleep(100); // 稍等重试
            }
            return false;
        }
    }
}
