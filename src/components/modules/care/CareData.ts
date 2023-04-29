const careData = {
    careTemp: {
        intermediate: {
            label: 'Intermediate',
            description: 'Plants grow well at a wide range of temperatures and do not require a significant temp drop at night.',
            tempRange: '58-70F at night, 70-85F during the day',
        },
        highland: {
            label: 'Highland',
            description: 'Plants require a significant temp drop at night and will need active cooling to thrive.',
            tempRange: '50F-62F lows at night, 70-78F during the day.'
        },
        lowland: {
            label: 'Lowland',
            description: 'Plants need warm conditions to thrive, may require heating.',
            tempRange: '70F-80F lows at night, 80-90F highs during the day.'

        },
        roomTemp: {
            label: 'Room temp',
            description: 'Plants do well at typical room tempatures.',
            tempRange: '67-80F day or night.'
        },
    },
    guideData: {
        general: {
            fertilizer: "You can feed live, dead, or even dried insects to your plants as food.  If you would rather not, or to supplement these feedings, here are a few options for fertilizers.  I generally rotate between these three for variety, and apply every 2-4 weeks: Maxsea - kelp based fertilizer that is mixed with water and                sprayed on leaves and in pitchers. I use 1/8tsp per gallon. Osmocote - pellets that can be placed in pitchers and will release slowly when temperatures rise &#62; 75&deg;F. Nutricote - pellets that can be placed in pitchers and will release slowly with exposure to water/pitcher fluid.",
            light: "I grow all my plants under LED grow lights, specifically HLG 65 V2 4000K and Florawave P80. You can also grow them in a windowsill or greenhouse.",
            water: "Carnivorous plants need water with low Total Dissolved Solids (TDS), such as distilled, reverse osmosis, or rain water.",
        },
        genus:{
            nepenthes: {
                label: "Nepenthes",
                locale: "Nepenthes are native to Southeast Asia and parts of Africa and Australia. The pitchers are modified leaves that trap insects and digest them for nutrition.",
                humidity: "Some nepenthes can adapt to normal room level humidity, however in my experience, all nepenthes do better with supplemental humidity. I keep mine between 75-90% RH",
                light: "Light requirements vary by species and as such, you should research the natural conditions of yours species. Generally, most nepenthes grow in a forest and are shaded for much of the day, thus they don't need particularly high light levels. If grown in a greenhouse, shade cloth is required.",
                water: "I never let my nepenthes sit in water.  I keep them moist and let the water drain off.",
                temperature: "Nepenthes generally fall into three categories: Highland: these plants live at high elevations and require temperature drops of 10-20°F at night. Intermediate: plants that live between the highland and lowland areas and can adapt to a wide range of conditions. Lowland: these plants live at low elevations in hot, humid conditions and may require heating above normal room temps.",
                media: "Most nepenthes do well in a loose draining mix of long-fibered sphagnum moss and perlite. I also use coco husk chips, although it's important to find a brand that has low salt content.",
                referencePhotoFilename: 'Nepenthes.jpg',
                referencePhotoPath: 'https://stl-lc101-sept-22.github.io/js-assignment-4-html-me-something-fearthelettuce/photos/IMG_20210828_144445.jpg',

            },
            heliamphora: {
                label: "Heliamphora",
                locale: "Heliamphora are native to highland plateaus called Tepuis in South America. Tepuis and receive a ridiculous amount of rainfall which washes away most nutrients in the soil, thus Heliamphora have adapted to get their nutrition from... other sources 😉.",
                humidity: "Heliamphora need supplemental humidity to thrive. I keep mine between 75-90% RH.",
                water: "Since Heliamphora natually get a tremendous amount of rain, I generally give them more water than my Nepenthes and I make sure to fill the pitchers with each watering.",
                temperature: "I grow most of my Heliamphora at mostly intermediate conditions, avoiding temperatures above 79°F. Some more advanced species do require cooler temperatures.",
                media: "I used the same mix as nepenthes, a loose draining mix of long-fibered sphagnum moss and perlite. I also use coco husk chips, although it's important to find a brand that has low salt content.",
                light: "Heliamphora will take as much light as you can give them. When given enough light, most species will have beautify red coloration.",
                referencePhotoFilename: 'Heliamphora.jpg',
                referencePhotoPath: 'https://stl-lc101-sept-22.github.io/js-assignment-4-html-me-something-fearthelettuce/photos/Heliamphora.jpg',
            },
            cephalotus: {
                label: "Cephalotus",
                locale: "Cephalotus are native to the coastal areas of southwest Australia. They live in sandy coastal areas.",
                humidity: "I haven't found Cephs to be particularly picky about humidity. I grow mine in my basement freely open to the room air. Too much humidity can cause fungus problems.",
                water: "Cephalotus should be kept drier than many other carnivorous plants. I top water the plants and let the trays dry between watering.",
                temperature: "Cephalotus grow well at a wide range of temperatures. They can tolerate heat into the 90s and can handle temperatures into the 40s.",
                media: "I use a mixture of peat, sand and pumice. I like to add a top layer of lava rock or slate to prevent moss and algae.",
                light: "Cephalotus appreciate high light levels and develop beautiful coloration when given these conditions.",
                referencePhotoFilename: 'Cephalotus.jpg',
                referencePhotoPath: 'https://stl-lc101-sept-22.github.io/js-assignment-4-html-me-something-fearthelettuce/photos/Ceph.jpg',
            },
        },
    }

}

export default careData