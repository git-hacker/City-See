using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CitySee.AuthorizationCenter.Dto
{
    public class UserinfoRequest
    {
        [StringLength(15)]
        public string PhoneNumber { get; set; }
        [StringLength(50)]
        public string Password { get; set; }
        [StringLength(50)]
        public string Email { get; set; }
        [StringLength(50)]
        public string UserName { get; set; }
        [StringLength(512)]
        public string Avatar { get; set; }

    }
}
