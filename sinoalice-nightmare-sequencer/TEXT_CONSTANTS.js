export const usageText = `I'm sure that the usage of this tool is quite self explanatory already, but I'll give a quick rundown of the features and usage. First, as you probably know, this is a nightmare planner for SINoALICE's colosseum game mode. All you need to do to use it is just click a nightmare and it'll be added to the timeline. Note that there is a restriction that nightmares will always be added where the previous nightmare's effect ends. And that is something that I don't plan on changing. This isn't intended to be some advanced tool where you can add multiple alternative nightmares as backup plans after all.

And I suspect that the high level guilds out there probably have their own dedicated master strategist with their own tools anyway, haha.

So, continuing on, you can find the skill details of each nightmare by hovering over the image of the nightmare. They'll show as a tooltip.

Another feature (or restriction, depending on how you see it) is that when you select a nightmare, all nightmares with the same skill are darkened and will not be able to be selected. This is because you cannot summon multiple nightmares with the same skill in colosseum. This is represents that in-game restriction. Of course, that restriction does not apply for certain special events, but we don't talk about that here ;)

If you’ve made a mistake in nightmare selection, you can deselect it by either clicking it again, or clicking the clear all button. If you're having a hard time looking for a specific nightmare to deselect, you can find it in the "Selected Nightmares" tab.

And if you didn’t notice, there’s a specific colour scheme I’m using for nightmares in the timeline:

- Grey: Nightmare Preparation
- Red: Fire elementals + fire bells
- Blue: Water elementals + water bells
- Green: Wind elementals + wind bells
- Dark Red: Fire debuffs
- Dark Blue: Water debuffs
- Dark Green: Wind debuffs
- Light Red: Fire Weapon SP reduction
- Light Blue: Water Weapon SP Reduction
- Light Green: Wind Weapon SP Reduction
- Light Pink: Other Effects


Another hmm... feature…? That was kinda added in was the miscellaneous statistics. Well, I won't say much about it, since I didn't know what would be useful as statistics, so I ended up throwing in whatever sounded useful. You can look at that if you're feeling bored I guess, haha.

And finally, the main feature is the filtering functionality. You can check each tab for different categories of nightmares, and these categories can be further divided into sub tabs and then you can apply filters using the toggle switches in those tabs. One thing to note here is that the filtering works by showing only nightmares which have all of the selected tags. So keep that in mind if things suddenly disappear when you flip too many switches ;) Hopefully, this will make it easier to search for nightmares by skill type (And maybe even find alternatives, haha).

Oh, right, and there's the ability to switch the view to the JP server nightmares too. All the functions mentioned above apply to the JP nightmares too, but their names and descriptions will be in Japanese. Well, the the tabs and filter option text won't change though (*cough* I don't know Japanese *cough*).

Other features of note:
- Vertically resizable chart, in case you have a loooong list of nightmares (Resize handles are a bit hard to see, but they’re right above the miscellaneous statistics button tab. There’s 3 of them. One on both corners, and in the middle)
- Option to sort by rarity and element type
- Special consideration for Chimera’s skill “Haze Heralds the Moment”. Any nightmare added after a nightmare with the skill “Haze Heralds the Moment” will have their preparation time reduced.
- Time calculations in the miscellaneous statistics section does not include time that exceeds the colosseum time limit. In other words, if a nightmare preparation time or effective time ends after the time limit, that extra time will not be counted. This is to give a more accurate representation of time spent. (Yes, I actually went out of my way to do that so that it was more accurate, lol)
- Meme 40 min colo option, in honour of our special 2nd anniversary treatment xD`

export const developmentText = `The idea of creating this tool began with finding Eucelia's Nightmare Planner. When I first saw it, I thought, that was a brilliant idea. A tool that could bring the lofty title of strategist into the hands of mere mortals such as us.

Imagine, only needing to click a few buttons to devise a grand master plan that could bring enemy guilds to their knees… Such power…! Well, ahem, anyway it seemed like a nice tool to have for people just getting into things, so it was definitely an interesting idea.

Anyway, so I played around with it, I thought that there could be improvements that could be made to make it nicer to use. And since it seemed the developer no longer played the game, and since I thought this would be an interesting way to test out my own skills as a developer, I thought I'd try my hand at it.

(If you haven’t noticed, I’m not actually a nightmare planner/shotcaller for any guild. I’m the sheep to the shepherd. I just do what I’m told, haha. I don't know a thing about planning nightmares xD)

The main goals in the development of my own app, put simply, was a nicer looking timeline chart, and an improved categorisation and filtering system. Obviously, if I wasn't certain that I could improve on those 2 aspects, then there would be no point in starting anything. So to begin, I searched for libraries that would allow me to draw a graph or chart that could represent the 20 minutes spent in colosseum. And, this was, surprisingly, quite a challenge.

When I first set out with my minuscule amount of knowledge, I only had one type of chart in mind: A gantt chart. The main reason I thought of a gantt chart was because I thought it fit the way nightmares worked. You can only summon one after another. Kinda like how one task depends on another one being finished first. It’s like a very… linear version of one. So I began my search by looking for libraries that could plot gantt charts, and although they existed, they were only suitable for time ranges between days, weeks, months, and years. And that was not suitable for my use case. So after many hours, and days so searching, I found something that could be adapted for my use case: Google Charts.

Specifically, the Timeline chart of Google Charts. It was almost exactly what I had been searching for, with only one problem: It only plotted timelines in chronological order. That is, from 0:00 to 20:00. And well, yes, that is quite logical, it makes sense. But in the context of SINoALICE's colosseum mode, it doesn't quite fit, since in colosseum, it's actually a timer that counts down from 20:00, so you'd need to do some mental calculations to line things up in realtime. Now, you've probably realised at this point if you've used my tool, but I never did end up fixing that.

Yes. It proved to be too high of a hurdle for little old me to overcome, unfortunately.

At any rate, looking at my first git commit, my work began in proper on June 20, experimenting with the React Google Chart library and using the Timeline chart. After confirming that it worked as I expected it to, I then moved onto working on a way to retrieve data from the SINoALICE DB.

For this, my initial thought was to use web scraping to obtain the data I needed, but after wading through about 3/4 of the web scraping code, I realised that there was in fact an API that I could use to get the data I needed without resorting to the incredible slog that was web scraping.

So, I went and used it. Oh, but wait! Things never go as smoothly as they're planned! Of course, it is a law of life that things never go as planned. The next issue I ran into was... That the data from the API was not only missing English skill descriptions, but even some of the data was wrong! Some of the nightmare's EN skill names had the JP skill name instead! So, with these new problems cropping up, I obviously had to find a way to get around them. So, the solution for getting the English skill descriptions was, well, just going back to using my web scraping code. The ideal solution would have been to retrieve wherever the DB was getting their descriptions from, but well, the meagre amount of knowledge I had didn’t allow for me to figure it out, so web scraping it was.

The second problem of EN skill name fields having JP names was actually quite an odd one. Well, before that, I was wondering, why have an EN skill name field, but not have a EN skill description accompanying it? And then the second thing was, why the heck are there JP skill names in some of those fields? Well, I never got the answer to those questions, and it’s not right of me to criticise when I don’t know the inner workings of how they run the database, so anyway, moving onto the problem: I’ve structured my database to have a table of “Base Skill Names” which is what I call skill names without the rank attached to them. Each colosseum skill has a foreign key relation which must reference a “Base Skill Name” in the table. So, there’s about 65 unique base skills, and each row basically has the JP name, and the equivalent EN name (Scraped from the dataabase). And since it’s just a measly 65 rows, I had a quick look and thought: “Hold on, why the heck are there JP names in the EN column?”. So then began my journey of writing more code to ensure that JP names weren’t being inserted into the EN name column.

But you might ask, why even split the colosseum skill names into something like “Base Skill Names”? Well, this is directly related to the tagging and filtering system I’ve implemented here. Basically, I sure as heck don’t want to go through all 600+ nightmares to tag each and every one of them. And if we’re looking at All the different colosseum skills that nightmares can have, sure, there’s nightmares that share the exact same skills, so by tagging unique skills, that would save some time, but that’s still over 100 skills at least. So the idea was to go the next level up. I looked through a bunch of skills and found that skills with the same name all had the same effect, with only the skill rank determining how powerful the effect was. So I split up the skills into “Base Skill Name”, and “Rank”. The “Base Skill Name” alone doesn’t tell us much about how strong the effect is in colosseum, but what it does tell us, is the general effect it has. And that was exactly what I needed for my tagging functionality. And the best part was that there were only about 65 “Base Skill Names”, and when I tagged one, the tag automatically extends to every skill and nightmare that references that base skill name. Also quite nice for future proofing when new nightmares are introduced. As long as the base skill name is one that’s already been tagged, that nightmare will automatically be tagged with that skill. Well, that’s the final result, but internally, that’s achieved with using foreign keys and a bunch of table joins, but it would take way too long to go through each and every step, haha.

Now, you might or might not have noticed, but designing the database was probably the most enjoyable part of the whole development process. (And, by enjoyable, I mean least painful *cough*). It's funny how that works, since one of the units I got the lowest marks for in uni was database systems, haha. Hmm, I’ve already talked a bit about the database structure, but I’ll just backtrack a bit. So I initially started by drawing up an ER diagram, with all the entities, foreign key relations and whatnot, and just went about implementing it.

Well, it sounds pretty simple, but it was actually quite hard to find a free database host that offered relational databases for use. In the end, I did find one and it was actually quite nice to use (offered PostgreSQL, which I never used before, but was quite similar to MySQL which I have used before). In implementing the database, one of the biggest issues I faced was actually something pretty stupid.

I wrote the commands to create the database directly on their platform and I don't know if it was a mistake on my part, or if there was something buggy going on, but I ended up losing the commands I used to create the tables... Hours of effort, down the drain just like that... Anywho, I ended up spending another 2 hours (Less time, since I was getting used to using PostgreSQL at that point) rewriting the commands and saving them locally this time for safety.

That was probably one of the best choices I made in the whole project (Or maybe not saving them in the first place was probably one of the most stupid decisions I ever made) because I actually ended up modifying the table schemas multiple times over the project as I added features to the app. Actually, the idea of splitting the colosseum skill names came in one of these revisions, I didn’t have that idea initially, haha.

Anyway, with the database in place, and after fixing any issues with the nightmare data, I went back to the frontend to finish up the UI.

It really shouldn't have been much to do. Just take the data and display it, right? Well, I now understand why people say, "The devil is in the details".

If it was just the implementing the ability to add nightmares clicked to the timeline chart one after another, then... that was probably done over a week ago, haha. But since this is my very first personal project, I figured I should put some more time and effort into it. So I ended adding a bunch of other features to make it more "app-like".

So, notifications when adding/removing nightmares from the list, darkening nightmares with the same skills, and so on.

But in adding all that, I realised that my app took a massive hit in performance. That is, it took about 1-2 seconds for nightmares with the same skill to darken when a nightmare was clicked. Obviously, that was utterly unacceptable. I mean, who wants to wait an entire second to see stuff happen?

Anywho, from there, I ended up dong a bunch of optimisations to speed things up. Even ended up getting getting rid of some libraries since they were surprisingly resource intensive. After about 3 days of going at it, I ended up dropping the render time to about 100ms which was... Not the best, but it was usable (*cough* I think that's what it is right now *cough*).

Although… Having said that, my initial load time for the page is still, uh, well, if you’re here, then you should know how it is. It’s not… The fastest… I’m not sure what to do about that to be honest, haha.

Well, after reducing the render time, I thought, "Man, this feels a bit empty", so what did I do? I ended up sinking even more time by doing a little miscellaneous statistics feature, which uh, probably isn't all that useful, but seeing some tables and charts is quite nice... Right? Well, at least it doesn’t affect the performance all that much, so I guess it’s okay… Right? Ahem, anyway. I've probably gone on for a bit too long, haha.

At any rate, the current date at the time of writing this is 14 July 2022. This means that this simple looking tool was nearly a month long project… Also, with the completion of this project, I can now confidently say that I absolutely hate CSS and any kind of UI design, ahaha. (Edit: Actually, it turns out that deployment and hosting was a massive pain as well. Ended up spending another 2 days trying to figure that stuff out, so the title of most disliked aspect might be a tie with that xD)

Whew, anyway, I'll wrap this up by saying thanks to Eucelia and the nightmare planner tool they created, as well as SINoALICE DB for the data they have available.

Without the nightmare planner tool, I never would have thought of creating this app, and without SINoALICE DB, I wouldn't have had a way to get all this data and present the web app that you see here today.

I don't like making guarantees, but I'll… try to keep this up for as long as I can, unless unexpected issues come up. I don't know if this tool will still be around or relevant by the time this game hits EoS (Or if it’s of any use even now, lol, with the diminishing playerbase), but I know I'll be playing the game till EoS, whether I maintain this thing or not, haha.

If there's any issues, shoot me a message on Discord, I may... or may not try to resolve them. Feeling kinda burnt out to be honest, ahaha.

And with this, I'll be returning to my life of having my job applications rejected. Hope you all have a good day, or night, and if you read this wall of text to the end, thanks for hearing me out ^^

Written by a tired and weary Sentiment#0790`