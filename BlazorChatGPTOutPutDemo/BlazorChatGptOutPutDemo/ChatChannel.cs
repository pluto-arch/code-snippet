using System.Text;

namespace BlazorChatGptOutPutDemo
{
    public class ChatChannel
    {
        public event Func<string, string, Task> OnMessageReceived;


        public void SendMessage(string messageId, string question, CancellationToken cancellationToken)
        {
            _ = Task.Run(async () =>
            {
                await Task.Delay(Random.Shared.Next(100, 1000), cancellationToken);
                var file = Path.Combine(Environment.CurrentDirectory, "TxtFiles", "text.txt");
                using var reader = new StreamReader(File.OpenRead(file), Encoding.UTF8);
                while (await reader.ReadLineAsync(cancellationToken) is { } line)
                {
                    if (!string.IsNullOrEmpty(line))
                    {
                        OnMessageReceived?.Invoke(messageId, line);
                    }
                }
            }, cancellationToken);
        }
    }
}
