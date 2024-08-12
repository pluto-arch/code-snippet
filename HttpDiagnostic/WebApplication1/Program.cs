
using System.Collections.Concurrent;
using System.Diagnostics;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Channels;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DiagnosticAdapter;
using Microsoft.Extensions.Logging.Abstractions;

namespace WebApplication1
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var channel = Channel.CreateUnbounded<Logd>();


            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddMemoryCache();

            var app = builder.Build();

            var ob = new HttpClientObserver(channel);
            var dis2 = DiagnosticListener.AllListeners.Subscribe(ob);
            var lifetime = app.Services.GetService<IHostApplicationLifetime>();
            lifetime?.ApplicationStopping.Register(() =>
            {
                ob?.Dispose();
                dis2?.Dispose();
            });


            lifetime?.ApplicationStarted.Register(() =>
            {
                var logger = app.Services.GetService<ILogger<DiagnosticListener>>()??NullLogger<DiagnosticListener>.Instance;
                var memoryCache = app.Services.GetService<IMemoryCache>();
                _ =Task.Run(async () =>
                {
                    await foreach (var contentLength in channel.Reader.ReadAllAsync())
                    {
                        var bytesInMB = contentLength.Bytes / (1024.0 * 1024.0);
                        var keys = StringToMD5(contentLength.Path);
                        var key = $"{keys}{DateTime.Now:yyyyMMdd}";
                        long count = 0;
                        if (memoryCache!=null)
                        {
                            count=IncrementCacheValue(memoryCache,key,1);
                        }
                        logger.LogInformation($"Path: {contentLength.Path}, Total MB: {bytesInMB:N4}. 第:{count}次调用");
                    }
                });
            });


            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }


        public static long IncrementCacheValue(IMemoryCache memoryCache, string key, long incrementBy = 1)
        {
            if (memoryCache.TryGetValue(key, out long currentValue))
            {
                long newValue = currentValue + incrementBy;
                memoryCache.Set(key, newValue);
                return newValue;
            }
            memoryCache.Set(key, incrementBy);
            return incrementBy;
        }

        public static string StringToMD5(string input)
        {
            using var md5 = MD5.Create();
            byte[] inputBytes = Encoding.ASCII.GetBytes(input);
            byte[] hashBytes = md5.ComputeHash(inputBytes);

            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < hashBytes.Length; i++)
            {
                sb.Append(hashBytes[i].ToString("X2"));
            }
            return sb.ToString();
        }
    }



    public class HttpClientObserver : IObserver<DiagnosticListener>, IDisposable
    {
        private readonly Channel<Logd> _channel;
        private readonly List<IDisposable> _subscriptions = [];

        public HttpClientObserver(Channel<Logd> channel)
        {
            _channel = channel;
        }

        public void OnCompleted()
        {

        }

        public void OnError(Exception error)
        {
        }
        public void OnNext(DiagnosticListener value)
        {
            if (value.Name == "HttpHandlerDiagnosticListener")
            {
                var subscription = value.SubscribeWithAdapter(this);
                _subscriptions.Add(subscription);
            }
        }

        [DiagnosticName("System.Net.Http.Response")]
        public void HttpResponse(HttpResponseMessage? response)
        {
            if (response==null)
            {
                return;
            }
           
            var length = response.Content.Headers.ContentLength;
            var path = response.RequestMessage?.RequestUri?.AbsolutePath;
            if (string.IsNullOrEmpty(path))
            {
                path = response.RequestMessage?.RequestUri?.Host??"";
            }

            if (!length.HasValue)
            {
                var memoryStream = new MemoryStream();
                response.Content.CopyTo(memoryStream,null,default);
                length = memoryStream.Length;
                memoryStream.Position = 0;
                response.Content = new StreamContent(memoryStream);
            }

            var m = new Logd
            {
                Path = path??"",
                Bytes = length??0
            };

            _channel.Writer.TryWrite(m);
        }

        public void Dispose()
        {
            _subscriptions?.ForEach(item=>item?.Dispose());
        }
    }

    public class Logd
    {
        public string Path { get; set; }

        public long Bytes { get; set; }
    }

}
