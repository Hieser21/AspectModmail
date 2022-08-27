const Discord = require('discord.js')
const { Client, GatewayIntentBits, Partials } = require("discord.js")
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers], partials: [Partials.Channel] })
const Token = "MTAxMDU5MDIxMzQ5MzUwMTk3Mg.Gm-_c8.ioqBddhjN8EFG5fBfQJpYobBvhOCtWv4IsKKDE"
const Prefix = ">"

client.on('ready', () =>{
    console.log("Logged in as " + client.user.tag)
})

client.on('messageCreate', (message) =>{
    if(message.author.bot){return}

    
})

client.login(Token);