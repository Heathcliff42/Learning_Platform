import Inquirer from "inquirer";
import promtSync from "prompt-sync";
export { displaySelectionMenu };
export { prompt };
const PROMPT = promtSync();

function prompt(output) {
  let input = PROMPT(output);
  if (input === "EXIT") {
    console.clear();
    PROMPT("Goodbye");
    console.clear();
    process.exit();
  }
  return input;
}

async function displaySelectionMenu(data, Message, startIndex = 0) {
  console.clear();
  const choices = data.map((item, index) => ({
    name: `${index + 1 + startIndex}. ${item}`,
    value: index,
  }));
  const answer = await Inquirer.prompt([
    {
      type: "list",
      name: "selection",
      message: Message,
      choices: choices,
    },
  ]);
  return answer.selection + startIndex;
}
/*
let questions = [
  [
    "What is the capital of France?",
    ["Paris", "Lyon", "Marseille", "Nice"]
  ],
  [
    "What is the capital of Germany?",
    ["Berlin", "Munich", "Frankfurt", "Hamburg"]
  ],
  [
    "What is the capital of Italy?",
    ["Rome", "Milan", "Naples", "Turin"]
  ],
  [
    "What is the capital of Spain?",
    ["Madrid", "Barcelona", "Valencia", "Seville"]
  ],
  [
    "What is the capital of the United Kingdom?",
    ["London", "Manchester", "Birmingham", "Liverpool"]
  ],
  [
    "What is the capital of the United States?",
    ["Washington, D.C.", "New York", "Los Angeles", "Chicago"]
  ],
  [
    "What is the capital of Canada?",
    ["Ottawa", "Toronto", "Vancouver", "Montreal"]
  ],
  [
    "What is the capital of Australia?",
    ["Canberra", "Sydney", "Melbourne", "Brisbane"]
  ],
  [
    "What is the capital of Japan?",
    ["Tokyo", "Osaka", "Kyoto", "Nagoya"]
  ],
  [
    "What is the capital of China?",
    ["Beijing", "Shanghai", "Guangzhou", "Shenzhen"]
  ],
  [
    "What is the capital of Russia?",
    ["Moscow", "Saint Petersburg", "Novosibirsk", "Yekaterinburg"]
  ],
  [
    "What is the capital of Brazil?",
    ["Brasília", "Rio de Janeiro", "São Paulo", "Salvador"]
  ],
  [
    "What is the capital of India?",
    ["New Delhi", "Mumbai", "Bangalore", "Chennai"]
  ],
  [
    "What is the capital of South Africa?",
    ["Pretoria", "Cape Town", "Johannesburg", "Durban"]
  ],
  [
    "What is the capital of Egypt?",
    ["Cairo", "Alexandria", "Giza", "Luxor"]
  ],
  [
    "What is the capital of Nigeria?",
    ["Abuja", "Lagos", "Kano", "Ibadan"]
  ],
  [
    "What is the capital of Kenya?",
    ["Nairobi", "Mombasa", "Kisumu", "Nakuru"]
  ],
  [
    "What is the capital of Mexico?",
    ["Mexico City", "Guadalajara", "Monterrey", "Puebla"]
  ],
  [
    "What is the capital of Argentina?",
    ["Buenos Aires", "Córdoba", "Rosario", "Mendoza"]
  ],
  [
    "What is the capital of Chile?",
    ["Santiago", "Valparaíso", "Concepción", "La Serena"]
  ],
  [
    "What is the capital of Peru?",
    ["Lima", "Arequipa", "Cusco", "Trujillo"]
  ],
  [
    "What is the capital of Colombia?",
    ["Bogotá", "Medellín", "Cali", "Barranquilla"]
  ],
  [
    "What is the capital of Venezuela?",
    ["Caracas", "Maracaibo", "Valencia", "Barquisimeto"]
  ],
  [
    "What is the capital of Saudi Arabia?",
    ["Riyadh", "Jeddah", "Mecca", "Medina"]
  ],
  [
    "What is the capital of Turkey?",
    ["Ankara", "Istanbul", "Izmir", "Antalya"]
  ],
  [
    "What is the capital of Greece?",
    ["Athens", "Thessaloniki", "Patras", "Heraklion"]
  ],
  [
    "What is the capital of Portugal?",
    ["Lisbon", "Porto", "Braga", "Coimbra"]
  ],
  [
    "What is the capital of Sweden?",
    ["Stockholm", "Gothenburg", "Malmö", "Uppsala"]
  ],
  [
    "What is the capital of Norway?",
    ["Oslo", "Bergen", "Trondheim", "Stavanger"]
  ],
  [
    "What is the capital of Finland?",
    ["Helsinki", "Espoo", "Tampere", "Vantaa"]
  ],
  [
    "What is the capital of Denmark?",
    ["Copenhagen", "Aarhus", "Odense", "Aalborg"]
  ],
  [
    "What is the capital of Poland?",
    ["Warsaw", "Krakow", "Lodz", "Wroclaw"]
  ],
  [
    "What is the capital of Netherlands?",
    ["Amsterdam", "Rotterdam", "The Hague", "Utrecht"]
  ],
  [
    "What is the capital of Belgium?",
    ["Brussels", "Antwerp", "Ghent", "Bruges"]
  ],
  [
    "What is the capital of Austria?",
    ["Vienna", "Graz", "Linz", "Salzburg"]
  ],
  [
    "What is the capital of Switzerland?",
    ["Bern", "Zurich", "Geneva", "Basel"]
  ],
  [
    "What is the capital of Hungary?",
    ["Budapest", "Debrecen", "Szeged", "Miskolc"]
  ],
  [
    "What is the capital of Czech Republic?",
    ["Prague", "Brno", "Ostrava", "Plzen"]
  ],
  [
    "What is the capital of Slovakia?",
    ["Bratislava", "Kosice", "Presov", "Nitra"]
  ],
  [
    "What is the capital of Croatia?",
    ["Zagreb", "Split", "Rijeka", "Osijek"]
  ],
  [
    "What is the capital of Slovenia?",
    ["Ljubljana", "Maribor", "Celje", "Kranj"]
  ],
  [
    "What is the capital of Bulgaria?",
    ["Sofia", "Plovdiv", "Varna", "Burgas"]
  ],
  [
    "What is the capital of Romania?",
    ["Bucharest", "Cluj-Napoca", "Timisoara", "Iasi"]
  ],
  [
    "What is the capital of Serbia?",
    ["Belgrade", "Novi Sad", "Niš", "Kragujevac"]
  ],
  [
    "What is the capital of Bosnia and Herzegovina?",
    ["Sarajevo", "Banja Luka", "Tuzla", "Mostar"]
  ],
  [
    "What is the capital of Montenegro?",
    ["Podgorica", "Nikšić", "Herceg Novi", "Pljevlja"]
  ],
  [
    "What is the capital of Albania?",
    ["Tirana", "Durrës", "Vlorë", "Shkodër"]
  ],
  [
    "What is the capital of North Macedonia?",
    ["Skopje", "Bitola", "Kumanovo", "Prilep"]
  ],
  [
    "What is the capital of Kosovo?",
    ["Pristina", "Prizren", "Peć", "Mitrovica"]
  ]
];

for (let i = 0; i < questions.length; i++) {
  console.log(await displaySelectionMenu(questions[i][1], questions[i][0]));
}
/**/
