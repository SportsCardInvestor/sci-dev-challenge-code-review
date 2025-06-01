import { APIGatewayProxyHandler } from 'aws-lambda';
import fetch from 'node-fetch';

export const handler: APIGatewayProxyHandler = async () => {
  const response = await fetch('https://api.magicthegathering.io/v1/cards?subtype=Wizard');
  const data = await response.json();

  const wizards = (data.cards || [])
    .filter((card: any) => card.power)
    .sort((a: any, b: any) => parseInt(b.power) - parseInt(a.power))
    .map((card: any) => ({
      name: card.name,
      type: card.type,
      power: card.power,
      toughness: card.toughness,
      rarity: card.rarity,
      flavor: card.flavor,
      colors: card.colors,
      manaCost: card.manaCost,
      imageUrl: card.imageUrl,
    }));

  return {
    statusCode: 200,
    body: JSON.stringify(wizards),
    headers: {
      'Content-Type': 'application/json',
    },
  };
};
