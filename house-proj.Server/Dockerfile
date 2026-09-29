# 1. Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Update these two lines to use the DASH (-) instead of underscore (_)
COPY ["house-proj.Server.csproj", "./"]
RUN dotnet restore "house-proj.Server.csproj"

COPY . .
RUN dotnet publish "house-proj.Server.csproj" -c Release -o /app/publish

# 2. Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

# Make sure the DLL name also matches (usually matches the project name)
ENTRYPOINT ["dotnet", "house-proj.Server.dll"]