using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.Text;

namespace CitySee.Core
{
    public static class ModelStateExtension
    {
        public static string GetAllErrors(this ModelStateDictionary ModelState)
        {
            if (ModelState.IsValid)
                return "";
            System.Text.StringBuilder sbErrors = new System.Text.StringBuilder();
            foreach (var item in ModelState.Values)
            {
                if (item.Errors.Count > 0)
                {
                    for (int i = item.Errors.Count - 1; i >= 0; i--)
                    {
                        string msg = item.Errors[i].ErrorMessage;
                        if (String.IsNullOrEmpty(msg) && item.Errors[i].Exception != null)
                        {
                            msg = item.Errors[i].Exception.Message ?? "";
                        }

                        sbErrors.AppendLine(item.Errors[i].ErrorMessage + ":" + (item.RawValue?.ToString()));

                    }
                }
            }
            return sbErrors.ToString();

        }
    }
}
