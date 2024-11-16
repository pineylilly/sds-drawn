FROM kong:3.6
# Ensure any patching steps are executed as root user
USER root

# Add custom plugin to the image
COPY ./custom_plugin /usr/local/share/lua/5.1/kong/plugins
COPY ./proto /usr/local/kong/include

COPY ./kong.yaml /usr/local/kong/declarative/kong.yml
COPY ./kong.conf /etc/kong/kong.conf

ENV KONG_DATABASE=off
ENV KONG_PLUGINS=bundled,jwt-claim-to-header
ENV KONG_LUA_PACKAGE_PATH=/plugins/?.lua
ENV KONG_DECLARATIVE_CONFIG=/usr/local/kong/declarative/kong.yml
# ENV KONG_LUA_PACKAGE_PATH=./?.lua;./?/init.lua;
# ENV KONG_LUA_PACKAGE_PATH="/kong-custom-plugin/lua_modules/share/lua/5.1/kong/plugins/kong-custom-plugin/?.lua"

# Ensure kong user is selected for image execution
USER kong

# Run kong
ENTRYPOINT ["/docker-entrypoint.sh"]
EXPOSE 8000 8443 8001 8444 9080 9081 8002
STOPSIGNAL SIGQUIT
HEALTHCHECK --interval=10s --timeout=10s --retries=10 CMD kong health
CMD ["kong", "docker-start"]