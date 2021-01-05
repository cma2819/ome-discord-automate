# ome-discord-automate
Automate management discord's roles and channels

## Build

```
npm install
npm run build
```

## Environment variables

|key|description|
|:--|:--|
|DISCORD_BOT_TOKEN|Discord bot token available from discord developers portal|
|ROLE_ID_ADMIN|Administrator role ID. Sometimes bot only receive command from administrator.|

## Commands

### Greeting (Test bot works)

#### Command

```
!greet
```

#### Result

Bot will send message below:

```
Hello, admin!
```

### Build roles and channels

#### Command

```
!build <build-name> <tempalte-name>
```

#### Result

Create category named `<build-name>`, create roles and create channels in category followed by template json.

#### Templates

Template files (json) must be in directory `/templates`.

Template json's schema is like below:

``` json
{
    "name": <template-name>, // Build command finds template by this name.
    "roles": [
        <role-object>
        ...
    ],
    "channels": {
        "text": [
            <channel-object>
            ...
        ],
        "voice": [
            <channel-object>
            ...
        ]
    }
}
```

##### Role object

``` json
{
    "id": <role-id>, // Unique role ID used for define channel available roles.
    "name": <role-name>
}
```

##### Channel object

``` json
{
    "id": <channel-id>, // Unique channel ID
    "name": <channel-name>,
    "available": [
        <role-id>
        ...
    ] // Available roles only can view this channel.
}
```

## License

MIT License
