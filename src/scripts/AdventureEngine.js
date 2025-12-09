export class AdventureEngine {
    constructor() {
        this.key = 'adventure_save';
        this.story = {
            'start': {
                text: "You stand at the edge of the Data Wasteland. Rumors speak of the 'Unpoppable Bubble'—a legendary artifact that defies the laws of the Simulation. It is said to grant eternal uptime to whoever possesses it.",
                choices: [
                    { text: "Enter the Wasteland", next: 'wasteland_entry' },
                    { text: "Check your supplies", next: 'check_supplies' }
                ]
            },
            'check_supplies': {
                text: "You have your trusty Code Breaker (a rusty crowbar) and a flask of Java (coffee, not code). Not much, but it'll have to do.",
                choices: [
                    { text: "Enter the Wasteland", next: 'wasteland_entry' }
                ]
            },
            'wasteland_entry': {
                text: "The Wasteland is a glitchy mess of fragmented polygons and static. In the distance, you see two paths: one leading towards the Silicon Forest, and another towards the Neon City ruins.",
                choices: [
                    { text: "Head to Silicon Forest", next: 'forest_entry' },
                    { text: "Head to Neon City", next: 'city_entry' }
                ]
            },
            'forest_entry': {
                text: "The trees here are fractals, infinitely recurring patterns of green and brown. You hear a rustling sound. A wild Glitch-Fox appears! It seems friendly but unstable.",
                choices: [
                    { text: "Pet the Glitch-Fox", next: 'pet_fox' },
                    { text: "Ignore it and keep moving", next: 'forest_deep' }
                ]
            },
            'pet_fox': {
                text: "You reach out. The fox nuzzles your hand, vibrating with haptic feedback. It drops a shining keycard before vanishing into pixels. You pick it up.",
                loot: 'keycard',
                choices: [
                    { text: "Continue deeper", next: 'forest_deep' }
                ]
            },
            'forest_deep': {
                text: "Deep in the forest, you find an ancient Server Monolith. It hums with low-frequency energy. There is a slot for a keycard.",
                choices: [
                    { text: "Insert Keycard", next: 'monolith_open', req: 'keycard' },
                    { text: "Examine the symbols", next: 'monolith_examine' },
                    { text: "Leave and head to the City", next: 'city_entry' }
                ]
            },
            'monolith_examine': {
                text: "The symbols are ancient HTML tags, long deprecated. <blink>, <marquee>... terrifying. You can't open it without a key.",
                choices: [
                    { text: "Back", next: 'forest_deep' }
                ]
            },
            'monolith_open': {
                text: "The Monolith slides open. Inside levitates a small, shimmering orb. Is this it? The Unpoppable Bubble?",
                choices: [
                    { text: "Touch the Orb", next: 'orb_touch' }
                ]
            },
            'orb_touch': {
                text: "As your finger grazes the surface, you realize... it's solid glass. It's a fake! A decorative paperweight from the pre-simulation era. But wait, there's a note: 'The real treasure is in the cloud.'",
                choices: [
                    { text: "Curse the Developers", next: 'bad_end_1' },
                    { text: "Look up at the sky", next: 'cloud_look' }
                ]
            },
            'city_entry': {
                text: "Neon City. The skyscrapers are advertisements for products that no longer exist. You navigate the alleyways. A shadowy figure approaches.",
                choices: [
                    { text: "Fight", next: 'city_fight' },
                    { text: "Talk", next: 'city_talk' }
                ]
            },
            'city_fight': {
                text: "You swing your Code Breaker. The figure dodges with 0ms latency. 'Whoa, easy there user!' it shouts. It's just an NPC vendor.",
                choices: [
                    { text: "Apologize and browse wares", next: 'city_talk' }
                ]
            },
            'city_talk': {
                text: "The vendor offers you a 'Reality Patch'. He claims it allows you to see the hidden paths. It costs all your Java.",
                choices: [
                    { text: "Buy Reality Patch", next: 'buy_patch', cost: 'java' },
                    { text: "Decline and explore", next: 'city_explore' }
                ]
            },
            'buy_patch': {
                text: "You drink the last of your coffee and hand over the flask. The vendor uploads the patch to your neural link. Suddenly, a staircase appears in the sky, leading to the Clouds.",
                loot: 'reality_patch',
                choices: [
                    { text: "Climb the Sky Stairs", next: 'cloud_climb' }
                ]
            },
            'city_explore': {
                text: "You wander the city for hours. Eventually, you get stuck in infinite geometry. You are forced to reboot.",
                choices: [
                    { text: "Reboot (Game Over)", next: 'start' }
                ]
            },
            'cloud_look': {
                text: "You look up. The clouds are literally servers floating in the sky. If only you could reach them.",
                choices: [
                    { text: "Back to Forest", next: 'forest_deep' },
                    { text: "Go to City", next: 'city_entry' }
                ]
            },
            'cloud_climb': {
                text: "You climb for what feels like an eternity. Finally, you reach the Cloud Layer. In the center sits a pedestal with a soap bubble that shimmers with all colors of the rainbow. It doesn't pop against the sharp winds.",
                choices: [
                    { text: "Claim the Unpoppable Bubble", next: 'good_end' }
                ]
            },
            'good_end': {
                text: "You hold the bubble. It feels warm. You have found it. The simulation stabilizes. You are the Admin now. CONGRATULATIONS!",
                isEnd: true,
                win: true,
                choices: [
                    { text: "Restart Simulation", next: 'start' }
                ]
            },
            'bad_end_1': {
                text: "You rage against the machine until your stamina depletes. You collapse, becoming just another background asset. GAME OVER.",
                isEnd: true,
                choices: [
                    { text: "Try Again", next: 'start' }
                ]
            }
        };

        this.state = this.load() || {
            currentNode: 'start',
            inventory: [],
            history: [] // For "back" functionality if needed, or just log
        };
    }

    load() {
        try {
            const data = localStorage.getItem(this.key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            return null;
        }
    }

    save() {
        try {
            localStorage.setItem(this.key, JSON.stringify(this.state));
        } catch (e) {
            console.error('Save failed', e);
        }
    }

    getCurrentNode() {
        return this.story[this.state.currentNode];
    }

    handleChoice(index, callbacks) {
        const node = this.getCurrentNode();
        const choice = node.choices[index];

        if (!choice) return;

        // Check Requirements
        if (choice.req && !this.state.inventory.includes(choice.req)) {
            return { error: "You lack the required item." };
        }

        // Apply Costs (Simulated for this simple version)
        if (choice.cost === 'java') {
            // Assume we start with it, or just abstract it away
        }

        // Move
        this.state.currentNode = choice.next;
        const newNode = this.story[this.state.currentNode];

        // Loot
        if (newNode.loot && !this.state.inventory.includes(newNode.loot)) {
            this.state.inventory.push(newNode.loot);
            if (callbacks.onLoot) callbacks.onLoot(newNode.loot);
        }

        // Achievements / Endings
        if (this.state.currentNode === 'start' && this.state.history.length === 0) {
             if (callbacks.onAchievement) callbacks.onAchievement('adventure_begins');
        }

        if (newNode.isEnd) {
             if (newNode.win) {
                 if (callbacks.onAchievement) callbacks.onAchievement('adventure_end_good');
                 // Check for 'adventure_truth' if they did something specific?
                 // For now, let's say owning the keycard and patch grants 'adventure_explorer'
                 if (this.state.inventory.includes('keycard') && this.state.inventory.includes('reality_patch')) {
                     if (callbacks.onAchievement) callbacks.onAchievement('adventure_explorer');
                 }
             } else {
                 if (callbacks.onAchievement) callbacks.onAchievement('adventure_end_bad');
             }
             // Reset state after end for replay (or keep it there until they click Restart)
             if (choice.text.includes("Restart") || choice.text.includes("Try Again")) {
                 this.state.inventory = [];
                 this.state.history = [];
                 // Achievement for survivor? (Maybe simple win)
             }
        }

        this.save();
        return newNode;
    }
}
