using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;

namespace CitySee.AuthorizationCenter
{
    public static class ICoreServiceCollectionExtensions
    {
        public static UserDefinedBuilder AddUserDefined(this IServiceCollection services)
        {
            if (services == null)
            {
                throw new ArgumentNullException(nameof(services));
            }

            return new UserDefinedBuilder(services);
        }


    }


    public class UserDefinedBuilder
    {
        public UserDefinedBuilder(IServiceCollection services)
        {
            Services = services ?? throw new ArgumentNullException(nameof(services));
        }

        IServiceCollection Services { get; }
    }
}
