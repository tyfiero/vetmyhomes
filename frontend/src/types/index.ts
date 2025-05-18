export type EnvironmentalRiskItem = {
	code: string;
	description: string;
	value: number | string;
};

export type EnvironmentalRiskDetail = {
	level: string;
	description: string;
	score: number;
	summary: string;
	items?: EnvironmentalRiskItem[];
};

export type EnvironmentalRisks = {
	earthquake: EnvironmentalRiskDetail | null;
	landslide: EnvironmentalRiskDetail | null;
	flood: EnvironmentalRiskDetail | null;
	wildfire: EnvironmentalRiskDetail | null;
	hurricane: EnvironmentalRiskDetail | null;
	summary: string;
};

export type PropertyDetail = {
	address: string;
	price: number;
	bedrooms: number;
	bathrooms: number;
	sqft: number;
	agent: string;
	agent_phone: string;
	agent_email: string;
	tract_fips: string;
	environmental_risks: EnvironmentalRisks;
	photos: string[];
};

// State of the agent, make sure this aligns with your agent's state.
export type AgentState = {
	properties: PropertyDetail[];
	outputs?: string;
};

export const PROPERTIES = {
	properties: [
		{
			address: "3038 E Laurelhurst Dr NE, Seattle, WA 98105",
			price: 21900000,
			bedrooms: 6,
			bathrooms: 7,
			sqft: 11271,
			agent: "COMPASS Bellevue",
			agent_phone: "",
			agent_email: "",
			tract_fips: "53033004101",
			environmental_risks: {
				earthquake: {
					level: "high",
					description: "Very high risk of earthquakes in this area.",
					score: 85.27,
					summary:
						"Extremely high regional risk for earthquakes; preparation and mitigation recommended.",
					items: [
						{
							code: "ERQK_RISKS",
							description: "Earthquake risk score",
							value: 85.27,
						},
					],
				},
				landslide: {
					level: "medium",
					description: "Moderate risk of landslides in this area.",
					score: 51.96,
					summary:
						"Possible risk due to terrain; especially relevant for hillside properties.",
					items: [
						{
							code: "LNDS_RISKS",
							description: "Landslide risk score",
							value: 51.96,
						},
					],
				},
				flood: null,
				wildfire: {
					level: "low-moderate",
					description: "Some risk of wildfire in this area.",
					score: 34.8,
					summary:
						"Urban setting, but some wildfire exposure especially near vegetation.",
					items: [
						{
							code: "WFIR_RISKS",
							description: "Wildfire risk score",
							value: 34.8,
						},
					],
				},
				hurricane: null,
				summary:
					"Very high earthquake risk, moderate landslide and some wildfire risk. No significant flood or hurricane threats noted.",
			},
			photos: [
				"https://ap.rdcpix.com/e46d5b6adb55d86b6baca9c0ba65f5f2l-m3090517208s.jpg",
				"https://ap.rdcpix.com/e46d5b6adb55d86b6baca9c0ba65f5f2l-m2041296007s.jpg",
			],
		},
		{
			address: "118 16th Ave, Seattle, WA 98122",
			price: 1250000,
			bedrooms: 4,
			bathrooms: 2,
			sqft: 2380,
			agent: "Jason Mitchell Real Estate WA",
			agent_phone: "",
			agent_email: "",
			tract_fips: "53033008700",
			environmental_risks: {
				earthquake: {
					level: "very high",
					description: "Extremely high risk of earthquakes in this area.",
					score: 93.12,
					summary:
						"Among the highest regional earthquake risk indices; insurance and preparedness highly recommended.",
					items: [
						{
							code: "ERQK_RISKS",
							description: "Earthquake risk score",
							value: 93.12,
						},
					],
				},
				landslide: {
					level: "medium",
					description: "Moderate risk of landslide.",
					score: 39.56,
					summary:
						"Moderate landslide risk; may be elevated for sloped parcels.",
					items: [
						{
							code: "LNDS_RISKS",
							description: "Landslide risk score",
							value: 39.56,
						},
					],
				},
				flood: null,
				wildfire: null,
				hurricane: null,
				summary:
					"Very high earthquake risk, moderate landslide risk, little risk of wildfire, flood, or hurricane.",
			},
			photos: [
				"https://ap.rdcpix.com/539b6546b0b5a15b3de9c62163ab13d7l-m1985514101s.jpg",
				"https://ap.rdcpix.com/539b6546b0b5a15b3de9c62163ab13d7l-m2414024482s.jpg",
			],
		},
		{
			address: "1808 Minor Ave Unit 912, Seattle, WA 98101",
			price: 600000,
			bedrooms: 1,
			bathrooms: 1,
			sqft: 652,
			agent: "The Agency Seattle",
			agent_phone: "",
			agent_email: "",
			tract_fips: "53033007302",
			environmental_risks: {
				earthquake: {
					level: "extreme",
					description:
						"This tract has an extremely high earthquake risk index; annualized risk is moderate, but asset exposure is severe.",
					score: 96.27,
					summary:
						"Earthquake risk index (score: 96.3), among the highest in the U.S. Annualized risk moderate, but excellent risk management, insurance, and building retrofits strongly advised.",
					items: [
						{
							code: "ERQK_RISKS",
							description: "Earthquake risk score",
							value: 96.27,
						},
						{
							code: "ERQK_AFREQ",
							description: "Annual frequency of earthquake events",
							value: 0.008522,
						},
						{
							code: "ERQK_EXPB",
							description: "Building loss exposure ($)",
							value: 1026858000.0,
						},
						{
							code: "ERQK_EALS",
							description: "Annual loss ratio for structures (%)",
							value: 97.16,
						},
					],
				},
				landslide: {
					level: "medium",
					description: "Moderate risk of landslide.",
					score: 55.26,
					summary: "City core parcel with moderate landslide risk.",
					items: [
						{
							code: "LNDS_RISKS",
							description: "Landslide risk score",
							value: 55.26,
						},
					],
				},
				flood: null,
				wildfire: null,
				hurricane: null,
				summary:
					"Extremely high earthquake risk, moderate landslide risk, and negligible flood/wildfire/hurricane probability.",
			},
			photos: [
				"https://ap.rdcpix.com/7654181c04174667b0ac658349d70608l-m3223651217s.jpg",
				"https://ap.rdcpix.com/7654181c04174667b0ac658349d70608l-m225685319s.jpg",
			],
		},
		{
			address: "[Address not disclosed], Seattle, WA 98112",
			price: 39950000,
			bedrooms: 3,
			bathrooms: 3,
			sqft: 4663,
			agent: "COMPASS",
			agent_phone: "",
			agent_email: "",
			tract_fips: "",
			environmental_risks: {
				earthquake: null,
				landslide: null,
				flood: null,
				wildfire: null,
				hurricane: null,
				summary: "Not enough data to assess environmental risks.",
			},
			photos: [
				"https://ap.rdcpix.com/c70dfd302691184a8a0e80b6cc0cb82al-m2352152279s.jpg",
				"https://ap.rdcpix.com/c70dfd302691184a8a0e80b6cc0cb82al-m4291970773s.jpg",
			],
		},
		{
			address: "5323 NE 42nd St, Seattle, WA 98105",
			price: 3859000,
			bedrooms: 4,
			bathrooms: 3,
			sqft: 4080,
			agent: "Windermere Real Estate/East",
			agent_phone: "",
			agent_email: "",
			tract_fips: "53033004101",
			environmental_risks: {
				earthquake: {
					level: "high",
					description: "Very high regional earthquake risk.",
					score: 85.27,
					summary:
						"Area is subject to significant earthquake risk and should implement resilience measures.",
					items: [
						{
							code: "ERQK_RISKS",
							description: "Earthquake risk score",
							value: 85.27,
						},
					],
				},
				landslide: {
					level: "medium",
					description: "Moderate risk of landslide in this area.",
					score: 51.96,
					summary:
						"Potential risk for properties on a slope or near embankments.",
					items: [
						{
							code: "LNDS_RISKS",
							description: "Landslide risk score",
							value: 51.96,
						},
					],
				},
				flood: null,
				wildfire: {
					level: "low-moderate",
					description: "Some risk due to environmental factors.",
					score: 34.8,
					summary: "Notable but not severe wildfire risk.",
					items: [
						{
							code: "WFIR_RISKS",
							description: "Wildfire risk score",
							value: 34.8,
						},
					],
				},
				hurricane: null,
				summary:
					"High earthquake risk, significant landslide risk, and some threat from wildfire. Little to no flood or hurricane risk.",
			},
			photos: [
				"https://ap.rdcpix.com/b37efd6ccf9ced9bdedea178ecec4d2cl-m2733086247s.jpg",
				"https://ap.rdcpix.com/b37efd6ccf9ced9bdedea178ecec4d2cl-m1821972447s.jpg",
			],
		},
	],
};
