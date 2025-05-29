"use client";
import React from 'react';



type CardProps = {
    name: string;
    set: string;
    cost: number;
    power: number;
    hp: string;
    type: string;
    traits: string[];
    rarity: string;
    frontArt: string;
};

export default function Card({ name, set, cost, power, hp, type, traits, rarity, frontArt }: CardProps) {
    return (
        <div className="card border border-gray-400 rounded-lg p-2 m-2 flex items-center bg-gray-800 text-white shadow-lg">
            {/* Left Image Section */}
            <div className="w-32 h-32 flex-shrink-0 mr-4">
                <Image src={frontArt} alt={name} className="w-full h-full object-cover rounded-lg" />
            </div>

            {/* Right Text Section */}
            <div className="flex flex-col justify-center">
                <h2 className="text-lg font-bold">{name}</h2>
                <p className="text-sm">Set: {set}</p>
                <p className="text-sm">Type: {type}</p>
                <p className="text-sm">Traits: {traits?.join(', ')}</p>
                <p className="text-sm">Cost: {cost}</p>
                <p className="text-sm">Power: {power}</p>
                <p className="text-sm">HP: {hp}</p>
                <p className="text-sm">Rarity: {rarity}</p>
            </div>
        </div>
    );
}
