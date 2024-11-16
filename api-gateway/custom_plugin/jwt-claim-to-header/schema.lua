local typedefs = require "kong.db.schema.typedefs"

return {
    name = "jwt-claim-to-header",
    fields = {
        {
            -- this plugin will only be applied to Services or Routes
            consumer = typedefs.no_consumer
        },
        {
            config = {
                type = "record",
                fields = {
                    {
                        uri_param_names = {
                            description = "A list of querystring parameters that Kong will inspect to retrieve JWTs.",
                            type = "array",
                            elements = {
                                type = "string"
                            },
                            default = {"jwt"}
                        }
                    },
                    { 
                        cookie_names = {
                            description = "A list of cookie names that Kong will inspect to retrieve JWTs.",
                            type = "set",
                            elements = {
                                type = "string" 
                            },
                            default = {"auth"}
                        }
                    },
                    {
                        claims_to_include = {
                            type = "array",
                            elements = {
                                type = "string"
                            },
                            default = {".*"}
                        }
                    },
                    {
                        continue_on_error = {
                            type = "boolean",
                            default = true
                        }
                    }
                }
            }
        }
    }
}