using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using System;

namespace CitySee.AuthorizationCenter
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .UseUrls($"http://*:6008")
                .Build();
            host.Run();
        }
    }
}
