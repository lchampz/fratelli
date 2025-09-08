import React from 'react';

export default function WelcomeIllustration() {
	return (
		<svg viewBox="0 0 650 650" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
			<defs>
				<linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
					
				</linearGradient>
				<linearGradient id="choco" x1="0%" y1="0%" x2="0%" y2="100%">
					<stop offset="0%" stopColor="#8B5E3C" />
					<stop offset="100%" stopColor="#68472B" />
				</linearGradient>
			</defs>
			<rect width="600" height="600" fill="url(#bg)" rx="24" />
			<ellipse cx="300" cy="420" rx="160" ry="18" fill="#D9C9B5" opacity="0.55" />
			<g transform="translate(150,140)">
				<rect x="90" y="160" width="220" height="120" rx="14" fill="url(#choco)" />
				<path d="M90 190 C110 170, 130 210, 150 190 C170 175, 190 210, 210 190 C230 175, 250 210, 270 190 C290 175, 310 210, 330 190 L330 160 L90 160 Z" fill="#F4E7DA"/>
				<circle cx="150" cy="145" r="10" fill="#C64646" />
				<circle cx="210" cy="135" r="10" fill="#C64646" />
				<circle cx="270" cy="150" r="10" fill="#C64646" />
				<rect x="120" y="240" width="36" height="36" rx="6" fill="#F2E7DA" opacity="0.35" />
				<rect x="250" y="240" width="36" height="36" rx="6" fill="#F2E7DA" opacity="0.35" />
			</g>
		</svg>
	);
} 