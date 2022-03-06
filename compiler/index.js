function memeFeature(yes) {
  if (yes) {
    return `if (message.content == PREFIX + "meme") {
    fetch("https://meme-api.herokuapp.com/gimme")
      .then((response) => {
        return response.json();
      })
      .then((myJson) => {
        try {
          embed = new Discord.MessageEmbed()
            .setTimestamp()
            .setColor(Config.color_embed)
            .setTitle(myJson.title || "??")
            .setURL(myJson.postLink || "??")
            .setAuthor("By " + myJson.author)
            .setFooter("Meme On " + myJson.subreddit)
            .setImage(myJson.preview[myJson.preview.length - 1]);
          message.channel.send(embed);
        } catch (err) {
          console.log("ERROR: Tried sending a meme embed, error occured");
          console.error(err);
        }
      });
  }`;
  } else {
    return "";
  }
}

function banFeature(yes) {
  if (yes) {
    return `if (message.content == PREFIX + "ban") {
    if (!message.member.roles.some((r) => ["Administrator"].includes(r.name)))
      return message.reply("Sorry, you don't have permissions to use this!");

    let member = message.mentions.members.first();
    if (!member)
      return message.reply("Please mention a valid member of this server");
    if (!member.bannable)
      return message.reply(
        "I cannot ban this user! Do they have a higher role? Do I have ban permissions?"
      );

    let reason = args.slice(1).join(" ");
    if (!reason) reason = "No reason provided";

    await member
      .ban(reason)
      .catch((error) =>
        message.reply(
          "Sorry " +
            message.author +
            " I couldn't ban because of : " +
            error +
            ""
        )
      );
    message.reply(
      member.user.tag +
        " has been banned by " +
        message.author.tag +
        " because: " +
        reason
    );
  }
`;
  } else {
    return "";
  }
}

function purgeFeature(yes) {
  if (yes) {
    return `if (message.content == PREFIX + "clear") {
    const deleteCount = parseInt(args[0], 10);
    if (!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply(
        "Please provide a number between 2 and 100 for the number of messages to delete"
      );
    const fetched = await message.channel.fetchMessages({ count: deleteCount });
    message.channel
      .bulkDelete(fetched)
      .catch((error) =>
        message.reply("Couldn't delete messages becasue of" + error)
      );
  }`;
  } else {
    return "";
  }
}

function pingFeature(yes) {
  if (yes) {
    return `
  if (message.content === PREFIX + "ping") {
    const m = await message.channel.send("Ping?");
    m.edit(
      "Pong! Latency is " +
        (parseInt(new Date().getTime()) - parseInt(m.createdTimestamp)) +
        "ms"
    );
  }
  `;
  } else {
    return "";
  }
}

function pollFeature(yes) {
  if (yes) {
    return `
    
      if (message.content.startsWith(PREFIX + "poll")) {
    let question = message.content.slice((PREFIX + "poll").length);
    if (!question) {
      const embed = new Discord.MessageEmbed()
        .setColor(Config.color_embed)
        .setDescription(question)
        .setFooter("Please enter something to poll for.");

      message.channel.send(embed);
      return;
    }
    const embed = new Discord.MessageEmbed()
      .setColor(Config.color_embed)
      .setDescription(question)
      .setFooter("Poll Started By: " + message.author.username);

    message.channel.send(embed);
    message
      .react("👍")
      .then(() => message.react("👎"))
      .then(() => message.react("🤷"))
      .catch(() => console.error("Emoji failed to react."));
  }
  `;
  } else {
    return "";
  }
}

function Compile(Data) {
  return `const fetch = require("node-fetch");
const Discord = require("discord.js");
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS] });

PREFIX = "${Data.prefix}";
Config = ${JSON.stringify(Data)}

client.on("ready", () => {
  console.log("LOGGED IN: as " + client.user.tag);
     client.user.setPresence({
        pid: ${process.pid},
        status: 'online',
    });
  client.user.setActivity("Powered By github.com/jareer12/Bot-o-maker", {
  type: "PLAYING",
  url: "https://github.com/jareer12/Bot-o-maker"
});
});

client.on("message", async (message) => {
  if (message.author.bot) return;
  ${memeFeature(Data.memes_feature || false)}
  ${pollFeature(Data.poll_feature || false)}
  ${pingFeature(Data.ping_feature || false)}
  ${purgeFeature(Data.clear_feature || false)}
  ${banFeature(Data.ban_feature || false)}
});

client.login("${Data.token}");
`;
}

module.exports = {
  Compile: Compile,
};
