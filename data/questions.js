const mode = ["Multiple Choice"];
const topic = ["Politics", "Pop Culture", "History", "Sports", "Miscellaneous"];
const question = [
  [
    [
      "Who was the current president of the United States in 2023?",
      "Joe Biden",
      "Donald Trump",
      "Barack Obama",
      "George W. Bush",
    ],
    [
      "In which country is Angela Merkel a prominent political figure?",
      "Germany",
      "France",
      "United Kingdom",
      "Italy",
    ],
    [
      "Which political ideology advocates for the abolition of private property and a classless society?",
      "Communism",
      "Capitalism",
      "Socialism",
      "Fascism",
    ],
    [
      'Who is known as the "Iron Lady" for her strong conservative leadership in the 1980s?',
      "Margaret Thatcher",
      "Angela Merkel",
      "Theresa May",
      "Indira Gandhi",
    ],
    [
      "What is the political system of Japan?",
      "Monarchy",
      "Republic",
      "Parliamentary Democracy",
      "Totalitarianism",
    ],
    [
      "In which year did the European Union (EU) officially form?",
      "1992",
      "2001",
      "1957",
      "1989",
    ],
    [
      'Who wrote "The Communist Manifesto" along with Karl Marx?',
      "Friedrich Engels",
      "Vladimir Lenin",
      "Leon Trotsky",
      "Joseph Stalin",
    ],
    [
      "What is the United Nations´ primary purpose?",
      "Promoting world peace and security",
      "Economic development",
      "Humanitarian aid",
      "Environmental conservation",
    ],
    [
      "Which country´s political system includes the House of Commons and the House of Lords?",
      "United Kingdom",
      "United States",
      "Canada",
      "Australia",
    ],
    [
      "Which international organization was founded in 1949 as a military alliance?",
      "NATO",
      "UN",
      "EU",
      "WHO",
    ],
    [
      "Which country has the world’s oldest functioning parliament?",
      "Iceland",
      "Switzerland",
      "United States",
      "United Kingdom",
    ],
    [
      "Who was the first female Prime Minister of the UK?",
      "Margaret Thatcher",
      "Theresa May",
      "Angela Merkel",
      "Benazir Bhutto",
    ],
    [
      "Which political system is based on the idea of a single ruler with absolute power?",
      "Autocracy",
      "Democracy",
      "Theocracy",
      "Oligarchy",
    ],
    [
      "Where is the International Court of Justice located?",
      "The Hague",
      "Geneva",
      "New York",
      "Vienna",
    ],
    [
      "Which historical event led to the creation of the United Nations?",
      "World War II",
      "World War I",
      "Cold War",
      "Korean War",
    ],
    [
      "Which political concept advocates minimal state interference in personal affairs?",
      "Libertarianism",
      "Authoritarianism",
      "Absolutism",
      "Communitarianism",
    ],
    [
      "Who was the primary author of the U.S. Declaration of Independence?",
      "Thomas Jefferson",
      "Benjamin Franklin",
      "John Adams",
      "James Madison",
    ],
    [
      "Which political philosopher wrote 'The Spirit of the Laws' advocating separation of powers?",
      "Montesquieu",
      "Thomas Hobbes",
      "John Locke",
      "Jean-Jacques Rousseau",
    ],
    [
      "Which international organization replaced the League of Nations?",
      "United Nations",
      "NATO",
      "G20",
      "EU",
    ],
    [
      "In which political system do power, resources, and means of production rest primarily in the hands of the state?",
      "Communism",
      "Democratic Socialism",
      "Mercantilism",
      "Laissez-faire Capitalism",
    ],
  ],
  [
    [
      "Who played the character of Iron Man in the Marvel Cinematic Universe?",
      "Robert Downey Jr.",
      "Chris Hemsworth",
      "Chris Evans",
      "Mark Ruffalo",
    ],
    [
      "Which animated film features a young lion cub named Simba?",
      "The Lion King",
      "Shrek",
      "Finding Nemo",
      "Moana",
    ],
    [
      "Who is the author of the Harry Potter book series?",
      "J.K. Rowling",
      "George R.R. Martin",
      "Stephen King",
      "Suzanne Collins",
    ],
    [
      'In the TV show "Friends," what is the name of Ross and Monica´s mother?',
      "Judy",
      "Carol",
      "Emily",
      "Janice",
    ],
    [
      'Which rapper is known for albums like "The Slim Shady LP" and "The Marshall Mathers LP"?',
      "Eminem",
      "Kanye West",
      "Jay-Z",
      "Drake",
    ],
    [
      'What is the fictional continent where most of the events of "Game of Thrones" take place?',
      "Westeros",
      "Middle-earth",
      "Narnia",
      "Hogwarts",
    ],
    [
      'Who won the Academy Award for Best Actor for his role in the movie "The Revenant"?',
      "Leonardo DiCaprio",
      "Brad Pitt",
      "Matthew McConaughey",
      "Joaquin Phoenix",
    ],
    [
      'What is the name of the most prominent magical school in the "Harry Potter" series?',
      "Hogwarts School of Witchcraft and Wizardry",
      "Beauxbatons Academy of Magic",
      "Durmstrang Institute",
      "Ilvermorny School of Witchcraft and Wizardry",
    ],
    [
      "Which TV series follows the lives of the Bluth family, known for their dysfunctional antics?",
      "Arrested Development",
      "The Office",
      "Parks and Recreation",
      "Brooklyn Nine-Nine",
    ],
    [
      'Who is the lead actor in the movie "The Matrix"?',
      "Keanu Reeves",
      "Laurence Fishburne",
      "Hugo Weaving",
      "Carrie-Anne Moss",
    ],
    [
      "Which band is sometimes called the 'Fab Four'?",
      "The Beatles",
      "The Rolling Stones",
      "Led Zeppelin",
      "Queen",
    ],
    [
      "Which movie features the line 'I’m king of the world!'?",
      "Titanic",
      "Avatar",
      "The Lion King",
      "Jurassic Park",
    ],
    [
      "What fictional town is the setting for 'Stranger Things'?",
      "Hawkins",
      "Sunnydale",
      "Riverdale",
      "Springfield",
    ],
    [
      "Which American singer is known as 'The King of Pop'?",
      "Michael Jackson",
      "Elvis Presley",
      "Prince",
      "Justin Timberlake",
    ],
    [
      "Which famous superhero is known for the phrase 'I am vengeance, I am the night'?",
      "Batman",
      "Superman",
      "Spider-Man",
      "Iron Man",
    ],
    [
      "Which pop star released the album '1989'?",
      "Taylor Swift",
      "Katy Perry",
      "Madonna",
      "Lady Gaga",
    ],
    [
      "What artist painted the Mona Lisa?",
      "Leonardo da Vinci",
      "Michelangelo",
      "Raphael",
      "Vincent van Gogh",
    ],
    [
      "Which actor portrayed Captain Jack Sparrow in 'Pirates of the Caribbean'?",
      "Johnny Depp",
      "Orlando Bloom",
      "Keira Knightley",
      "Geoffrey Rush",
    ],
    [
      "What is Stephen King’s longest published novel (by word count)?",
      "The Stand",
      "It",
      "Under the Dome",
      "11/22/63",
    ],
    [
      "Which film director created ‘Spirited Away’ and co-founded Studio Ghibli?",
      "Hayao Miyazaki",
      "Isao Takahata",
      "Makoto Shinkai",
      "Mamoru Hosoda",
    ],
  ],
  [
    [
      "In which year did Christopher Columbus reach America?",
      "1492",
      "1510",
      "1607",
      "1776",
    ],
    [
      "Who was the first President of the United States?",
      "George Washington",
      "Thomas Jefferson",
      "John Adams",
      "Benjamin Franklin",
    ],
    [
      "What event marked the beginning of World War I?",
      "Assassination of Archduke Franz Ferdinand",
      "Bombing of Pearl Harbor",
      "Battle of Stalingrad",
      "Treaty of Versailles",
    ],
    [
      "Who was the ancient Egyptian queen known for her relationships with Julius Caesar and Mark Antony?",
      "Cleopatra",
      "Nefertiti",
      "Hatshepsut",
      "Ramses II",
    ],
    [
      "What was the main cause of the French Revolution?",
      "Economic inequality",
      "Religious conflicts",
      "Invasion by foreign powers",
      "Lack of resources",
    ],
    [
      "In which year did the Berlin Wall fall, leading to the reunification of East and West Germany?",
      "1991",
      "1985",
      "1989",
      "1995",
    ],
    [
      'Who wrote the "I Have a Dream" speech delivered during the March on Washington in 1963?',
      "Martin Luther King Jr.",
      "Malcolm X",
      "John F. Kennedy",
      "Nelson Mandela",
    ],
    [
      "What ancient civilization built the city of Machu Picchu?",
      "Inca",
      "Aztec",
      "Maya",
      "Egyptian",
    ],
    [
      "Which empire was ruled by Emperor Ashoka and is known for spreading Buddhism?",
      "Maurya Empire",
      "Persian Empire",
      "Ottoman Empire",
      "Gupta Empire",
    ],
    [
      "What was the name of the ship that brought the Pilgrims to America in 1620?",
      "Mayflower",
      "Santa Maria",
      "Nina",
      "Golden Hind",
    ],
    [
      "Who led the Soviet Union during World War II?",
      "Joseph Stalin",
      "Vladimir Lenin",
      "Nikita Khrushchev",
      "Leonid Brezhnev",
    ],
    [
      "The Magna Carta was signed in which year?",
      "1215",
      "1066",
      "1492",
      "1314",
    ],
    [
      "Which civilization built the famous city of Tenochtitlan?",
      "Aztec",
      "Maya",
      "Inca",
      "Toltec",
    ],
    [
      "Who was famously known as 'The Maid of Orléans' in French history?",
      "Joan of Arc",
      "Marie Antoinette",
      "Catherine de Medici",
      "Eleanor of Aquitaine",
    ],
    [
      "Which war is often referred to as 'The Great War'?",
      "World War I",
      "World War II",
      "The Cold War",
      "The Gulf War",
    ],
    [
      "Which dynasty built most of the Great Wall of China as it stands today?",
      "Ming Dynasty",
      "Qing Dynasty",
      "Han Dynasty",
      "Tang Dynasty",
    ],
    [
      "Who was the British Prime Minister during most of World War II?",
      "Winston Churchill",
      "Neville Chamberlain",
      "Clement Attlee",
      "Margaret Thatcher",
    ],
    [
      "Which empire was known for its powerful legionaries and extensive road networks?",
      "The Roman Empire",
      "The Persian Empire",
      "The Mongol Empire",
      "The Ottoman Empire",
    ],
    [
      "What year is generally considered the fall of the Western Roman Empire?",
      "476 AD",
      "410 AD",
      "1453 AD",
      "1066 AD",
    ],
    [
      "Which leader initiated the Reign of Terror during the French Revolution?",
      "Maximilien Robespierre",
      "Georges Danton",
      "Napoleon Bonaparte",
      "Jean-Paul Marat",
    ],
  ],
  [
    [
      "In which country did the sport of football (soccer) originate?",
      "China",
      "England",
      "Brazil",
      "Italy",
    ],
    [
      "Who holds the record for the most Grand Slam singles titles in tennis?",
      "Novak Djokovic",
      "Serena Williams",
      "Roger Federer",
      "Rafael Nadal",
    ],
    [
      "Which country has won the most Olympic gold medals in the history of the Summer Olympics?",
      "United States",
      "China",
      "Russia",
      "Germany",
    ],
    [
      'Who is known as "The Greatest" in the sport of boxing?',
      "Muhammad Ali",
      "Mike Tyson",
      "Floyd Mayweather Jr.",
      "Joe Louis",
    ],
    [
      "In what year was the first modern Olympic Games held?",
      "1896",
      "1886",
      "1906",
      "1920",
    ],
    [
      "Which country won the FIFA World Cup in 2018?",
      "France",
      "Brazil",
      "Germany",
      "Argentina",
    ],
    [
      "How many players are on a standard football (soccer) team during a match?",
      "11",
      "9",
      "8",
      "7",
    ],
    [
      'Which athlete is often referred to as "King ____" in the sport of basketball?',
      "LeBron James",
      "Michael Jordan",
      "Kobe Bryant",
      "Magic Johnson",
    ],
    [
      "Who won the Tour de France a record seven consecutive times from 1999 to 2005?",
      "Lance Armstrong",
      "Chris Froome",
      "Eddy Merckx",
      "Miguel Indurain",
    ],
    [
      "In which sport would you perform a slam dunk?",
      "Basketball",
      "Football (Soccer)",
      "Tennis",
      "Golf",
    ],
    [
      "Which country is known for the Haka, a traditional war dance before rugby matches?",
      "New Zealand",
      "Australia",
      "Fiji",
      "South Africa",
    ],
    [
      "How many periods are played in a standard ice hockey game?",
      "3",
      "2",
      "4",
      "5",
    ],
    [
      "Which athlete has won the most Olympic gold medals overall?",
      "Michael Phelps",
      "Usain Bolt",
      "Carl Lewis",
      "Mark Spitz",
    ],
    [
      "What color is the jersey worn by the leader of the Tour de France?",
      "Yellow",
      "Green",
      "White",
      "Blue",
    ],
    [
      "What is the maximum break in a single frame of snooker?",
      "147",
      "155",
      "180",
      "200",
    ],
    [
      "Which sport’s championship is known as the Stanley Cup?",
      "Ice Hockey",
      "Basketball",
      "Baseball",
      "American Football",
    ],
    [
      "Where were the 2016 Summer Olympics held?",
      "Rio de Janeiro, Brazil",
      "London, UK",
      "Beijing, China",
      "Tokyo, Japan",
    ],
    [
      "Which country won the Rugby World Cup in 2019?",
      "South Africa",
      "England",
      "New Zealand",
      "Australia",
    ],
    [
      "In what year did Roger Bannister famously break the 4-minute mile?",
      "1954",
      "1949",
      "1951",
      "1960",
    ],
    [
      "Which football club is known for its prestigious youth academy called 'La Masia'?",
      "FC Barcelona",
      "Real Madrid",
      "Bayern Munich",
      "Ajax",
    ],
  ],
  [
    [
      "What is the fear of long words called?",
      "Hippopotomonstrosesquippedaliophobia",
      "Arachnophobia",
      "Acrophobia",
      "Claustrophobia",
    ],
    [
      "Which letter does not appear in any U.S. state name?",
      "Q",
      "J",
      "X",
      "Z",
    ],
    ["How many noses does a slug have?", "2", "10", "0", "1"],
    [
      "In the early days of baseball, what were baseballs often made from?",
      "Horsehide",
      "Rubber",
      "Wood",
      "Glass",
    ],
    [
      "What is the term for a group of flamingos?",
      "Flamboyance",
      "Colony",
      "Pod",
      "Flock",
    ],
    [
      "Which country has the most islands in the world?",
      "Sweden",
      "Canada",
      "Maldives",
      "Australia",
    ],
    [
      'What is the dot over the letters "i" and "j" called?',
      "Tittle",
      "Dotlet",
      "Pointle",
      "Speckle",
    ],
    [
      "In which year did the Great Emu War take place in Australia?",
      "1932",
      "1915",
      "1947",
      "1960",
    ],
    [
      "What is the world record for the most spoons balanced on a human body (as of 2021)?",
      "85",
      "62",
      "35",
      "17",
    ],
    [
      'Which planet is sometimes referred to as the "evening star" or "morning star" due to its visibility at certain times?',
      "Venus",
      "Mars",
      "Jupiter",
      "Mercury",
    ],
    [
      "What is the rarest blood type in the ABO system?",
      "AB-",
      "A-",
      "O+",
      "B+",
    ],
    [
      "Which country consumes the most chocolate per capita?",
      "Switzerland",
      "United States",
      "Belgium",
      "Germany",
    ],
    [
      "What is the main ingredient in guacamole?",
      "Avocado",
      "Tomato",
      "Lime Juice",
      "Garlic",
    ],
    [
      "Which is the longest river in the world by length?",
      "Nile",
      "Amazon",
      "Yangtze",
      "Mississippi",
    ],
    [
      "What does a seismograph measure?",
      "Earthquakes",
      "Temperature",
      "Humidity",
      "Wind speed",
    ],
    [
      "Which element has the chemical symbol 'Au'?",
      "Gold",
      "Silver",
      "Copper",
      "Iron",
    ],
    [
      "In what century was the printing press invented by Johannes Gutenberg?",
      "15th century",
      "14th century",
      "16th century",
      "12th century",
    ],
    [
      "In mathematics, the ratio (1 + √5) / 2 is known as what?",
      "The Golden Ratio",
      "Euler’s Number",
      "Planck’s Constant",
      "Avogadro’s Number",
    ],
    [
      "Which sea is connected to the Atlantic by the Strait of Gibraltar?",
      "Mediterranean Sea",
      "Red Sea",
      "Baltic Sea",
      "Adriatic Sea",
    ],
    [
      "What automotive pioneer is widely credited with developing the assembly line method of production?",
      "Henry Ford",
      "Karl Benz",
      "Ferruccio Lamborghini",
      "André Citroën",
    ],
  ],
];
