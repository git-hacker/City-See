using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using System;

namespace CitySee.AuthorizationCenter
{
    class Program
    {
        static void Main(string[] args)
        {
            var host = WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .UseUrls($"http://*:6000")
                .Build();
            host.Run();
        }
    }
}
