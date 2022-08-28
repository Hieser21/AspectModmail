require('dotenv').config()
const Discord = require('discord.js')
const { EmbedBuilder, ChannelType } = require('discord.js')
const { Client, Partials } = require('discord.js')
const { ActionRowBuilder, ButtonBuilder } = require('discord.js');

const client = new Client({intents: ["Guilds", "", "GuildMessages", "GuildPresences", "GuildMembers", "DirectMessages", "DirectMessageReactions", "MessageContent"], partials: [Partials.Channel]})
const token = process.env.TOKEN;

const guildID = process.env.GUILD
const archiveCategoryID = process.env.ARCHIVE
const modmailCategoryID = process.env.CATEGORY

client.on("ready", () =>{
    console.log(client.user.tag + " is now online!")
    client.user.setStatus("dnd")
})

client.on('messageCreate', (message) =>{
    var guild = client.guilds.cache.get(guildID)
    var modmailCategory = guild.channels.cache.get(modmailCategoryID)

    if (message.author.bot) return;
    if (message.channel.type === ChannelType.DM) {
        var channelName = message.author.id + "-modmail"
        var modmailChannel = guild.channels.cache.find(channel => channel.name === channelName)

        var messageEmbed = new EmbedBuilder()
            .setAuthor({ name: message.author.tag })
            .setTitle("ModMail Request")
            .setDescription(message.content)
            .setColor("#2EC76E")

        if (modmailChannel) {
            modmailChannel.send({ embeds: [messageEmbed] })
        } else {
            var modEmbed = new EmbedBuilder()
                .setTitle("Ticket Management")
                .setDescription("Here are some tools to manage this ModMail Ticket.")

            var ticketButtons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('closeModMail')
                        .setLabel("Delete Ticket")
                        .setStyle('Danger'),
                    
                    new ButtonBuilder()
                        .setCustomId('transcriptModMail')
                        .setLabel("Delete and Save Ticket")
                        .setStyle('Success')
                )

            guild.channels.create({
                name: channelName,
                parent: modmailCategory,
                type: ChannelType.GuildText
            }).then(channel => channel.send({ embeds: [modEmbed], components: [ticketButtons]})).then(message => message.channel.send({ embeds: [messageEmbed] }))
        }
        message.react("✅")

    } else {
        if (message.channel.parentId === modmailCategoryID) {
            var splitName = message.channel.name.split("-")
            var user = message.guild.members.cache.get(splitName[0])

            var messageEmbed = new EmbedBuilder()
                    .setTitle("Staff")
                    .setDescription(message.content)
                    .setColor("#2EC76E")
            
            user.send({ embeds: [messageEmbed] })
        }
    }
})

client.on('interactionCreate', (interaction) =>{
    var user = interaction.user
    var archiveCategory = client.guilds.cache.get(guildID).channels.cache.get(archiveCategoryID)

    if (interaction.isButton) {
        if (interaction.customId === "closeModMail") {

            var messageEmbed = new EmbedBuilder()
                .setTitle("ModMail Ticket Closed")
                .setDescription("Your ModMail ticket has been closed. Need more help? Just reply with your request!")
                .setColor("#E04C3C")
            
            interaction.channel.delete()
            
            if (interaction.channel.parentId === modmailCategoryID) {
                user.send({ embeds: [messageEmbed] })
                interaction.channel.delete()
            }
        } 
        if (interaction.customId === "transcriptModMail") {
            var messageEmbed = new EmbedBuilder()
                    .setTitle("ModMail Ticket Closed")
                    .setDescription("Your ModMail ticket has been closed. Need more help? Just reply with your request!")
                    .setColor("#E04C3C")
            
                user.send({ embeds: [messageEmbed] })
                interaction.channel.setParent(archiveCategory)
                interaction.message.delete()

                var modEmbed = new EmbedBuilder()
                    .setTitle("Manage Transcript")
                    .setDescription("This is a Transcript. Only Server Staff can view this ticket.")

                var ticketButton = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('closeModMail')
                            .setLabel("Delete Ticket")
                            .setStyle('Danger')
                    )

                interaction.channel.send({ embeds: [modEmbed], components: [ticketButton]})
        }
    }
})

client.login(token);