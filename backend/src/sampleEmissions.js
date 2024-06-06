const _ = require("lodash")

const emissions_time_range = {
  start: "2022-01-01T00:00:00+01:00",
  end: "2024-01-01T00:00:00+01:00",
  step: [
    2678400, 2419200, 2678400, 2592000, 2678400, 2592000,
    2678400, 2678400, 2592000, 2678400, 2592000, 2678400
  ]
};
const emissions_entities = [
          {
            id: 1,
            name: "Moroccan Oranges, Ltd",
            type: "Company",
            details: {
              supplier: false,
              customer: false,
              ownOperation: false,
              registration: "RC Agadir 51395",
              address: "20 avenue du Roi, Rabat, Maroc"
            },
            image: "https://centralguide.net/wp-content/uploads/2018/04/Walmart-Corporate-Office-300x227.jpg"
          },
          {
            id: 2,
            parent: 1,
            name: "Casablanca Oranges, Ltd",
            type: "Company",
            details: {
              supplier: true,
              customer: false,
              ownOperation: false,
              financialControl: true,
              operationalControl: true,
              capital: true,
              registration: "RC Casablanca 20394",
              address: "50 Boulevard de la Corniche, Casablanca, Maroc"
            },
            image: "https://www.pickardchilton.com/sites/default/files/styles/thumbnail/public/1606_N388_512r.jpg"
          },
          {
            id: 3,
            name: "Agro Novae Developpement, SCS",
            type: "Company",
            details: {
              supplier: false,
              customer: false,
              ownOperation: false,
              registration: "Manosque B 341 897 254",
              address: "Z.A. des moulins à vent\n11 espace Saint-Pierre"
            },
            image: "https://dev-13sqft.s3.ap-south-1.amazonaws.com/blogs/1619781438Warehouse-Design.jpg"
          },
          {
            id: 4,
            parent: 3,
            name: "Agro Novae Industrie, SAS",
            type: "Company",
            details: {
              supplier: false,
              customer: false,
              ownOperation: true,
              financialControl: false,
              operationalControl: false,
              capital: true,
              registration: "Manosque B 338 635 063",
              address: "Z.A. des moulins à vent\n11 espace Saint-Pierre"
            },
            image: "https://images.adsttc.com/media/images/5bda/0a95/f197/cc45/e900/0258/large_jpg/DYP_NWKA_BDA_04.jpg"
          },
          {
            id: 5,
            parent: 4,
            name: "Direction Industrielle",
            type: "Division",
            details: {
              supplier: false,
              customer: false,
              ownOperation: true,
              financialControl: true,
              operationalControl: true,
              address: "Z.A. des moulins à vent\n11 espace Saint-Pierre"
            }
          },
          {
            id: 6,
            parent: 5,
            name: "Shipping in",
            type: "Step"
          },
          {
            id: 7,
            parent: 5,
            name: "Unloading",
            type: "Step"
          },
          {
            id: 8,
            parent: 5,
            name: "Cold Storage",
            type: "Step"
          },
          {
            id: 9,
            parent: 5,
            name: "Cutting",
            type: "Step"
          },
          {
            id: 10,
            parent: 5,
            name: "Unfreezing",
            type: "Step"
          },
          {
            id: 11,
            parent: 5,
            name: "Cooking",
            type: "Step"
          },
          {
            id: 12,
            parent: 5,
            name: "Jar Filling",
            type: "Step"
          },
          {
            id: 13,
            parent: 5,
            name: "Packing",
            type: "Step"
          },
          {
            id: 14,
            parent: 5,
            name: "Shipping out",
            type: "Step"
          },
          {
            id: 15,
            parent: 4,
            name: "Direction Commerciale",
            type: "Division",
            details: {
              supplier: false,
              customer: false,
              ownOperation: true,
              financialControl: true,
              operationalControl: true,
              address: "Z.A. des moulins à vent\n11 espace Saint-Pierre"
            }
          },
          {
            id: 16,
            parent: 3,
            name: "Inovcorp, Lda",
            type: "Company",
            details: {
              supplier: false,
              customer: false,
              ownOperation: true,
              financialControl: false,
              operationalControl: false,
              capital: true,
              registration: "Carnaxide 507188365",
              address: "123 Avenida da Liberdade, Lisbon, Portugal"
            },
            image: "https://cdn.techwireasia.com/wp-content/uploads/2023/08/How-modern-agriculture-technology-embraces-photovoltaics-e1690881709902-897x500.jpg"
          },
          {
            id: 17,
            name: "50Bio Srl",
            type: "Company",
            details: {
              supplier: false,
              customer: true,
              ownOperation: false,
              registration: "P.Iva 02722220346",
              address: "22 Via del Corso, Roma, Italy"
            },
            image: "https://i.pinimg.com/originals/40/71/92/4071922ce9e18605e89d76ff5b366215.jpg"
          },
          {
            id: 18,
            name: "GrDF",
            type: "Company",
            details: {
              supplier: true,
              customer: false,
              ownOperation: false,
              registration: "Paris B 444 786 511",
              address: "6 rue Condorcet, 75009 Paris, France"
            },
            image: "https://3.bp.blogspot.com/-QX_kv9VpRNs/WRUUbf8l0PI/AAAAAAAAAIk/Q1ydNF5_RqEWkyvFc2-2ICR3xis48r86gCLcB/s1600/tokyo-rice-paddy-in-office.jpg"
          }
        ];
const emissions_areas = [
          {
            id: 1,
            name: "Africa",
            type: "Continent"
          },
          {
            id: 2,
            parent: 1,
            name: "Morocco",
            type: "Country"
          },
          {
            id: 3,
            parent: 2,
            name: "Casablanca",
            type: "City"
          },
          {
            id: 4,
            parent: 3,
            name: "50 Boulevard de la Corniche",
            type: "Location",
            details: {
              lat: 32,
              long: -6,
              operatorId: 2,
              ownerId: 1
            }
          },
          {
            id: 5,
            parent: 4,
            name: "Warehouse",
            type: "Unit",
            details: {
              lat: 32,
              long: -6,
              operatorId: 2,
              ownerId: 1
            }
          },
          {
            id: 6,
            name: "Europe",
            type: "Continent"
          },
          {
            id: 7,
            parent: 6,
            name: "Italy",
            type: "Country"
          },
          {
            id: 8,
            parent: 7,
            name: "Roma",
            type: "City"
          },
          {
            id: 9,
            parent: 8,
            name: "22 Via del Corso",
            type: "Location",
            details: {
              lat: 42.5,
              long: 12.5,
              operatorId: 17,
              ownerId: 17
            }
          },
          {
            id: 10,
            parent: 9,
            name: "Warehouse",
            type: "Unit",
            details: {
              lat: 42.5,
              long: 12.5,
              operatorId: 17,
              ownerId: 17
            }
          },
          {
            id: 11,
            parent: 6,
            name: "Portugal",
            type: "Country"
          },
          {
            id: 12,
            parent: 11,
            name: "Lisbon",
            type: "City"
          },
          {
            id: 13,
            parent: 12,
            name: "123 Avenida da Liberdade",
            type: "Location",
            details: {
              lat: 39.5,
              long: -8,
              operatorId: 16,
              ownerId: 16
            }
          },
          {
            id: 14,
            parent: 13,
            name: "Lab",
            type: "Unit",
            details: {
              lat: 39.5,
              long: -8,
              operatorId: 16,
              ownerId: 16
            }
          },
          {
            id: 15,
            parent: 6,
            name: "France",
            type: "Country"
          },
          {
            id: 16,
            parent: 15,
            name: "Peyruis",
            type: "City"
          },
          {
            id: 17,
            parent: 16,
            name: "Z.A. des moulins à vent\n11 espace Saint-Pierre",
            type: "Location",
            details: {
              lat: 44,
              long: 6,
              operatorId: 3,
              ownerId: 3
            }
          },
          {
            id: 18,
            parent: 17,
            name: "Factory building",
            type: "Unit",
            details: {
              lat: 44,
              long: 6,
              operatorId: 4,
              ownerId: 3
            }
          },
          {
            id: 19,
            parent: 17,
            name: "Shop building",
            type: "Unit",
            details: {
              lat: 43.99983,
              long: 6,
              operatorId: 3,
              ownerId: 3
            }
          }
        ];
const emissions_categories= [
          {
            id: 1,
            name: "Climate Change",
            era: ""
          },
          {
            id: 2,
            parent: 1,
            name: "GHG Protocol",
            era: ""
          },
          {
            id: 3,
            parent: 2,
            name: "Scope 1",
            code: "1",
            era: "O"
          },
          {
            id: 4,
            parent: 3,
            name: "Emissions directes des sources fixes de combustion",
            code: "1-1",
            era: "O"
          },
          {
            id: 5,
            parent: 3,
            name: "Emissions directes des sources mobiles de combustion",
            code: "1-2",
            era: "O"
          },
          {
            id: 6,
            parent: 3,
            name: "Emissions directes des procédés",
            code: "1-3",
            era: "O"
          },
          {
            id: 7,
            parent: 3,
            name: "Emissions directes fugitives",
            code: "1-4",
            era: "O"
          },
          {
            id: 8,
            parent: 2,
            name: "Scope 2",
            code: "2",
            era: "U"
          },
          {
            id: 9,
            parent: 8,
            name: "Emissions indirectes liées à la consommation d'électricité",
            code: "2-1",
            era: "U"
          },
          {
            id: 10,
            parent: 8,
            name: "Emissions indirectes liées à la consommation de vapeur, chaleur ou froid",
            code: "2-2",
            era: "U"
          },
          {
            id: 11,
            parent: 2,
            name: "Scope 3",
            code: "3",
            era: ""
          },
          {
            id: 12,
            parent: 11,
            name: "Upstream",
            era: "U"
          },
          {
            id: 13,
            parent: 12,
            name: "Produits et services achetés",
            code: "3-1",
            era: "U"
          },
          {
            id: 14,
            parent: 12,
            name: "Biens immobilisés",
            code: "3-2",
            era: "U"
          },
          {
            id: 15,
            parent: 12,
            name: "Emissions liées aux combustibles et à l'énergie (non inclus dans le scope 1 ou le scope 2)",
            code: "3-3",
            era: "U"
          },
          {
            id: 16,
            parent: 12,
            name: "Transport de marchandise amont et distribution",
            code: "3-4",
            era: "U"
          },
          {
            id: 17,
            parent: 12,
            name: "Déchets générés",
            code: "3-5",
            era: "U"
          },
          {
            id: 18,
            parent: 12,
            name: "Déplacements professionnels",
            code: "3-6",
            era: "U"
          },
          {
            id: 19,
            parent: 12,
            name: "Déplacements domicile travail",
            code: "3-7",
            era: "U"
          },
          {
            id: 20,
            parent: 12,
            name: "Actifs en leasing amont",
            code: "3-8",
            era: "U"
          },
          {
            id: 21,
            parent: 12,
            name: "Autres émissions indirectes amont",
            era: "U"
          },
          {
            id: 22,
            parent: 11,
            name: "Downstream",
            era: "D"
          },
          {
            id: 23,
            parent: 22,
            name: "Transport de marchandise aval et distribution",
            code: "3-9",
            era: "D"
          },
          {
            id: 24,
            parent: 22,
            name: "Transformation des produits vendus",
            code: "3-10",
            era: "D"
          },
          {
            id: 25,
            parent: 22,
            name: "Utilisation des produits vendus",
            code: "3-11",
            era: "D"
          },
          {
            id: 26,
            parent: 22,
            name: "Fin de vie des produits vendus",
            code: "3-12",
            era: "D"
          },
          {
            id: 27,
            parent: 22,
            name: "Actifs en leasing aval",
            code: "3-13",
            era: "D"
          },
          {
            id: 28,
            parent: 22,
            name: "Franchises",
            code: "3-14",
            era: "D"
          },
          {
            id: 29,
            parent: 22,
            name: "Investissements",
            code: "3-15",
            era: "D"
          },
          {
            id: 30,
            parent: 22,
            name: "Autres émissions indirectes aval",
            era: "D"
          },
          {
            id: 31,
            parent: 1,
            name: "BEGES",
            era: ""
          },
          {
            id: 32,
            parent: 31,
            name: "Scope 1",
            era: "O"
          },
          {
            id: 33,
            parent: 32,
            name: "Emissions directes des sources fixes de combustion",
            code: "1",
            era: "O"
          },
          {
            id: 34,
            parent: 32,
            name: "Emissions directes des sources mobiles à moteur thermique",
            code: "2",
            era: "O"
          },
          {
            id: 35,
            parent: 32,
            name: "Emissions directes des procédés hors énergie",
            code: "3",
            era: "O"
          },
          {
            id: 36,
            parent: 32,
            name: "Emissions directes fugitives",
            code: "4",
            era: "O"
          },
          {
            id: 37,
            parent: 32,
            name: "Emissions issues de la biomasse (sols et forêts)",
            code: "5",
            era: "O"
          },
          {
            id: 38,
            parent: 31,
            name: "Scope 2",
            era: "U"
          },
          {
            id: 39,
            parent: 38,
            name: "Emissions indirectes liées à la consommation d'électricité",
            code: "6",
            era: "U"
          },
          {
            id: 40,
            parent: 38,
            name: "Emissions indirectes liées à la consommation de vapeur, chaleur ou froid",
            code: "7",
            era: "U"
          },
          {
            id: 41,
            parent: 31,
            name: "Scope 3",
            era: ""
          },
          {
            id: 42,
            parent: 41,
            name: "Emissions liées à l'énergie non incluses dans les postes 1 à 7",
            code: "8",
            era: "U"
          },
          {
            id: 43,
            parent: 41,
            name: "Achats de produits ou services",
            code: "9",
            era: "U"
          },
          {
            id: 44,
            parent: 41,
            name: "Immobilisations de biens",
            code: "10",
            era: "U"
          },
          {
            id: 45,
            parent: 41,
            name: "Déchets",
            code: "11",
            era: "U"
          },
          {
            id: 46,
            parent: 41,
            name: "Transport de marchandise amont",
            code: "12",
            era: "U"
          },
          {
            id: 47,
            parent: 41,
            name: "Déplacements professionnels",
            code: "13",
            era: "U"
          },
          {
            id: 48,
            parent: 41,
            name: "Actifs en leasing amont",
            code: "14",
            era: "U"
          },
          {
            id: 49,
            parent: 41,
            name: "Investissements",
            code: "15",
            era: "D"
          },
          {
            id: 50,
            parent: 41,
            name: "Transport des visiteurs et des clients",
            code: "16",
            era: "U"
          },
          {
            id: 51,
            parent: 41,
            name: "Transport de marchandise aval",
            code: "17",
            era: "D"
          },
          {
            id: 52,
            parent: 41,
            name: "Utilisation des produits vendus",
            code: "18",
            era: "D"
          },
          {
            id: 53,
            parent: 41,
            name: "Fin de vie des produits vendus",
            code: "19",
            era: "D"
          },
          {
            id: 54,
            parent: 41,
            name: "Franchise aval",
            code: "20",
            era: "D"
          },
          {
            id: 55,
            parent: 41,
            name: "Leasing aval",
            code: "21",
            era: "D"
          },
          {
            id: 56,
            parent: 41,
            name: "Déplacements domicile travail",
            code: "22",
            era: "U"
          },
          {
            id: 57,
            parent: 41,
            name: "Autres émissions indirectes",
            code: "23",
            era: "U"
          },
          {
            id: 58,
            parent: 1,
            name: "ISO/TR 14069:2013",
            era: ""
          },
          {
            id: 59,
            parent: 58,
            name: "Scope 1",
            era: "O"
          },
          {
            id: 60,
            parent: 59,
            name: "Emissions directes des sources fixes de combustion",
            code: "1",
            era: "O"
          },
          {
            id: 61,
            parent: 59,
            name: "Emissions directes des sources mobiles de combustion",
            code: "2",
            era: "O"
          },
          {
            id: 62,
            parent: 59,
            name: "Emissions directes des procédés",
            code: "3",
            era: "O"
          },
          {
            id: 63,
            parent: 59,
            name: "Emissions directes fugitives",
            code: "4",
            era: "O"
          },
          {
            id: 64,
            parent: 59,
            name: "Emissions directes issues de l'UTCF",
            code: "5",
            era: "O"
          },
          {
            id: 65,
            parent: 58,
            name: "Scope 2",
            era: "U"
          },
          {
            id: 66,
            parent: 65,
            name: "Emissions indirectes liées à la consommation d'électricité",
            code: "6",
            era: "U"
          },
          {
            id: 67,
            parent: 65,
            name: "Emissions indirectes liées à la consommation d'énergie de réseau (hors électricité)",
            code: "7",
            era: "U"
          },
          {
            id: 68,
            parent: 58,
            name: "Scope 3",
            era: ""
          },
          {
            id: 69,
            parent: 68,
            name: "Emissions liées à l'énergie non incluses dans les postes 1 à 7",
            code: "8",
            era: "U"
          },
          {
            id: 70,
            parent: 68,
            name: "Achats de produits",
            code: "9",
            era: "U"
          },
          {
            id: 71,
            parent: 68,
            name: "Biens immobilisés",
            code: "10",
            era: "U"
          },
          {
            id: 72,
            parent: 68,
            name: "Déchets générés",
            code: "11",
            era: "U"
          },
          {
            id: 73,
            parent: 68,
            name: "Transport de marchandise amont et distribution",
            code: "12",
            era: "U"
          },
          {
            id: 74,
            parent: 68,
            name: "Déplacements professionnels",
            code: "13",
            era: "U"
          },
          {
            id: 75,
            parent: 68,
            name: "Actifs en leasing amont",
            code: "14",
            era: "U"
          },
          {
            id: 76,
            parent: 68,
            name: "Investissements",
            code: "15",
            era: "D"
          },
          {
            id: 77,
            parent: 68,
            name: "Transport des visiteurs et des clients",
            code: "16",
            era: "U"
          },
          {
            id: 78,
            parent: 68,
            name: "Transport de marchandise aval et distribution",
            code: "17",
            era: "D"
          },
          {
            id: 79,
            parent: 68,
            name: "Utilisation des produits vendus",
            code: "18",
            era: "D"
          },
          {
            id: 80,
            parent: 68,
            name: "Fin de vie des produits vendus",
            code: "19",
            era: "D"
          },
          {
            id: 81,
            parent: 68,
            name: "Franchise aval",
            code: "20",
            era: "D"
          },
          {
            id: 82,
            parent: 68,
            name: "Leasing aval",
            code: "21",
            era: "D"
          },
          {
            id: 83,
            parent: 68,
            name: "Déplacements domicile travail",
            code: "22",
            era: "U"
          },
          {
            id: 84,
            parent: 68,
            name: "Autres émissions indirectes",
            code: "23",
            era: "U"
          },
          {
            id: 85,
            parent: 1,
            name: "BEGES v5",
            era: ""
          },
          {
            id: 86,
            parent: 85,
            name: "Emissions directes de GES",
            code: "1",
            era: "O"
          },
          {
            id: 87,
            parent: 86,
            name: "Emissions directes des sources fixes de combustion",
            code: "1-1",
            era: "O"
          },
          {
            id: 88,
            parent: 86,
            name: "Emissions directes des sources mobiles de combustion",
            code: "1-2",
            era: "O"
          },
          {
            id: 89,
            parent: 86,
            name: "Emissions directes des procédés hors énergie",
            code: "1-3",
            era: "O"
          },
          {
            id: 90,
            parent: 86,
            name: "Emissions directes fugitives",
            code: "1-4",
            era: "O"
          },
          {
            id: 91,
            parent: 86,
            name: "Emissions issues de la biomasse (sols et forêts)",
            code: "1-5",
            era: "O"
          },
          {
            id: 92,
            parent: 85,
            name: "Emissions indirectes associées à l'énergie",
            code: "2",
            era: "U"
          },
          {
            id: 93,
            parent: 92,
            name: "Emissions indirectes liées à la consommation d'électricité",
            code: "2-1",
            era: "U"
          },
          {
            id: 94,
            parent: 92,
            name: "Emissions indirectes liées à la consommation de vapeur, chaleur ou froid",
            code: "2-2",
            era: "U"
          },
          {
            id: 95,
            parent: 85,
            name: "Emissions indirectes associées au transport",
            code: "3",
            era: ""
          },
          {
            id: 96,
            parent: 95,
            name: "Transport de marchandise amont",
            code: "3-1",
            era: "U"
          },
          {
            id: 97,
            parent: 95,
            name: "Transport de marchandise aval",
            code: "3-2",
            era: "D"
          },
          {
            id: 98,
            parent: 95,
            name: "Déplacements domicile travail",
            code: "3-3",
            era: "U"
          },
          {
            id: 99,
            parent: 95,
            name: "Transport des visiteurs et des clients",
            code: "3-4",
            era: "U"
          },
          {
            id: 100,
            parent: 95,
            name: "Déplacements professionnels",
            code: "3-5",
            era: "U"
          },
          {
            id: 101,
            parent: 85,
            name: "Emissions indirectes associées aux produits achetés",
            code: "4",
            era: "U"
          },
          {
            id: 102,
            parent: 101,
            name: "Achat de biens",
            code: "4-1",
            era: "U"
          },
          {
            id: 103,
            parent: 101,
            name: "Immobilisations de biens",
            code: "4-2",
            era: "U"
          },
          {
            id: 104,
            parent: 101,
            name: "Gestion des déchets",
            code: "4-3",
            era: "U"
          },
          {
            id: 105,
            parent: 101,
            name: "Actifs en leasing amont",
            code: "4-4",
            era: "U"
          },
          {
            id: 106,
            parent: 101,
            name: "Achats de services",
            code: "4-5",
            era: "U"
          },
          {
            id: 107,
            parent: 85,
            name: "Emissions indirectes associées aux produits vendus",
            code: "5",
            era: "D"
          },
          {
            id: 108,
            parent: 107,
            name: "Utilisation des produits vendus",
            code: "5-1",
            era: "D"
          },
          {
            id: 109,
            parent: 107,
            name: "Actifs en leasing aval",
            code: "5-2",
            era: "D"
          },
          {
            id: 110,
            parent: 107,
            name: "Fin de vie des produits vendus",
            code: "5-3",
            era: "D"
          },
          {
            id: 111,
            parent: 107,
            name: "Investissements",
            code: "5-4",
            era: "D"
          },
          {
            id: 112,
            parent: 85,
            name: "Autres émissions indirectes",
            code: "6",
            era: ""
          },
          {
            id: 113,
            parent: 112,
            name: "Autres émissions indirectes",
            code: "6-1",
            era: ""
          }
        ];

const emissions_beges = [
  {
    time_range: emissions_time_range,
    indexes: {
      entity: emissions_entities,
      area: emissions_areas,
      category: emissions_categories,
    },
    data: [
      [  0, 1, 0.001002,  1, 1, 4, 16, 17, 32],
      [  1, 1, 0.000998,  2, 1, 4, 16, 17, 32],
      [  2, 1, 0.001001,  3, 1, 4, 16, 17, 32],
      [  3, 1, 0.001003,  4, 1, 4, 16, 17, 32],
      [  4, 1, 0.001004,  5, 1, 4, 16, 17, 32],
      [  5, 1, 0.001000,  6, 1, 4, 16, 17, 32],
      [  6, 1, 0.000999,  7, 1, 4, 16, 17, 32],
      [  7, 1, 0.001005,  8, 1, 4, 16, 17, 32],
      [  8, 1, 0.001001,  9, 1, 4, 16, 17, 32],
      [  9, 1, 0.000997, 10, 1, 4, 16, 17, 32],
      [ 10, 1, 0.001002, 11, 1, 4, 16, 17, 32],
      [ 11, 1, 0.001003, 12, 1, 4, 16, 17, 32],
      [ 12, 1, 0.001,    13, 1, 4, 16, 17, 32],
      [ 13, 1, 0.001001, 14, 1, 4, 16, 17, 32],
      [ 14, 1, 0.001004, 15, 1, 4, 16, 17, 32],
      [ 15, 1, 0.000998, 16, 1, 4, 16, 17, 32],
      [ 16, 1, 0.001002, 17, 1, 4, 16, 17, 32],
      [ 17, 1, 0.001001, 18, 1, 4, 16, 17, 32],
      [ 18, 1, 0.001,    19, 1, 4, 16, 17, 32],
      [ 19, 1, 0.000999, 20, 1, 4, 16, 17, 32],
      [ 20, 1, 0.001003, 21, 1, 4, 16, 17, 32],
      [ 21, 1, 0.001,    22, 1, 4, 16, 17, 32],
      [ 22, 1, 0.001002, 23, 1, 4, 16, 17, 32],
      [ 23, 1, 0.000997, 24, 1, 4, 16, 17, 32],
      
      [  0, 1, 0.001002,  3, 1, 4, 16, 17, 32],
      [  3, 1, 0.000801, 15, 1, 4, 16, 17, 32],
      [ 15, 1, 0.000603, 24, 1, 4, 16, 17, 32]
    ]}
  ]

const emissions_begesv5 = [
  {
    time_range: emissions_time_range,
    indexes: {
      entity: emissions_entities,
      area: emissions_areas,
      category: emissions_categories,
    },
    data: [

	    [0,  1.0, 1.002e-3, 1,  1.0, 10, 17, 17, 86],
	    [1,  1.0, 0.998e-3, 2,  1.0, 10, 17, 17, 86],
	    [2,  1.0, 1.001e-3, 3,  1.0, 10, 17, 17, 86],
	    [3,  1.0, 1.003e-3, 4,  1.0, 10, 17, 17, 86],
	    [4,  1.0, 1.004e-3, 5,  1.0, 10, 17, 17, 86],
	    [5,  1.0, 1.000e-3, 6,  1.0, 10, 17, 17, 86],
	    [6,  1.0, 0.999e-3, 7,  1.0, 10, 17, 17, 86],
	    [7,  1.0, 1.005e-3, 8,  1.0, 10, 17, 17, 86],
	    [8,  1.0, 1.001e-3, 9,  1.0, 10, 17, 17, 86],
	    [9,  1.0, 0.997e-3, 10, 1.0, 10, 17, 17, 86],
	    [10, 1.0, 1.002e-3, 11, 1.0, 10, 17, 17, 86],
	    [11, 1.0, 1.003e-3, 12, 1.0, 10, 17, 17, 86],
	    [12, 1.0, 1.000e-3, 13, 1.0, 10, 17, 17, 86],
	    [13, 1.0, 1.001e-3, 14, 1.0, 10, 17, 17, 86],
	    [14, 1.0, 1.004e-3, 15, 1.0, 10, 17, 17, 86],
	    [15, 1.0, 0.998e-3, 16, 1.0, 10, 17, 17, 86],
	    [16, 1.0, 1.002e-3, 17, 1.0, 10, 17, 17, 86],
	    [17, 1.0, 1.001e-3, 18, 1.0, 10, 17, 17, 86],
	    [18, 1.0, 1.000e-3, 19, 1.0, 10, 17, 17, 86],
	    [19, 1.0, 0.999e-3, 20, 1.0, 10, 17, 17, 86],
	    [20, 1.0, 1.003e-3, 21, 1.0, 10, 17, 17, 86],
	    [21, 1.0, 1.000e-3, 22, 1.0, 10, 17, 17, 86],
	    [22, 1.0, 1.002e-3, 23, 1.0, 10, 17, 17, 86],
	    [23, 1.0, 0.997e-3, 24, 1.0, 10, 17, 17, 86],

	    [0,  1.0, 1.002e-3,  3, 1.0, 10, 17, 17, 86],
	    [3,  1.0, 0.801e-3, 15, 1.0, 10, 17, 17, 86],
	    [15, 1.0, 0.603e-3, 24, 1.0, 10, 17, 17, 86]

    ]
  }
]

const emissions_ghgprotocol = [
  {
    time_range: emissions_time_range,
    indexes: {
      entity: emissions_entities,
      area: emissions_areas,
      category: emissions_categories,
    },
    data: [
	    [0,  1.0, 1.002e-3, 1,  1.0, 3, 16, 17, 3],
	    [1,  1.0, 0.998e-3, 2,  1.0, 3, 16, 17, 3],
	    [2,  1.0, 1.001e-3, 3,  1.0, 3, 16, 17, 3],
	    [3,  1.0, 1.003e-3, 4,  1.0, 3, 16, 17, 3],
	    [4,  1.0, 1.004e-3, 5,  1.0, 3, 16, 17, 3],
	    [5,  1.0, 1.000e-3, 6,  1.0, 3, 16, 17, 3],
	    [6,  1.0, 0.999e-3, 7,  1.0, 3, 16, 17, 3],
	    [7,  1.0, 1.005e-3, 8,  1.0, 3, 16, 17, 3],
	    [8,  1.0, 1.001e-3, 9,  1.0, 3, 16, 17, 3],
	    [9,  1.0, 0.997e-3, 10, 1.0, 3, 16, 17, 3],
	    [10, 1.0, 1.002e-3, 11, 1.0, 3, 16, 17, 3],
	    [11, 1.0, 1.003e-3, 12, 1.0, 3, 16, 17, 3],
	    [12, 1.0, 1.000e-3, 13, 1.0, 3, 16, 17, 3],
	    [13, 1.0, 1.001e-3, 14, 1.0, 3, 16, 17, 3],
	    [14, 1.0, 1.004e-3, 15, 1.0, 3, 16, 17, 3],
	    [15, 1.0, 0.998e-3, 16, 1.0, 3, 16, 17, 3],
	    [16, 1.0, 1.002e-3, 17, 1.0, 3, 16, 17, 3],
	    [17, 1.0, 1.001e-3, 18, 1.0, 3, 16, 17, 3],
	    [18, 1.0, 1.000e-3, 19, 1.0, 3, 16, 17, 3],
	    [19, 1.0, 0.999e-3, 20, 1.0, 3, 16, 17, 3],
	    [20, 1.0, 1.003e-3, 21, 1.0, 3, 16, 17, 3],
	    [21, 1.0, 1.000e-3, 22, 1.0, 3, 16, 17, 3],
	    [22, 1.0, 1.002e-3, 23, 1.0, 3, 16, 17, 3],
	    [23, 1.0, 0.997e-3, 24, 1.0, 3, 16, 17, 3],

	    [0,  1.0, 1.002e-3,  3, 1.0, 3, 16, 17, 3],
	    [3,  1.0, 0.801e-3, 15, 1.0, 3, 16, 17, 3],
	    [15, 1.0, 0.603e-3, 24, 1.0, 3, 16, 17, 3]
    ]
  }
]

const emissions_isotr14069 = [
  {
    time_range: emissions_time_range,
    indexes: {
      entity: emissions_entities,
      area: emissions_areas,
      category: emissions_categories,
    },
    data: [
	    [0,  1.0, 1.002e-3, 1,  1.0, 10, 17, 17, 59],
	    [1,  1.0, 0.998e-3, 2,  1.0, 10, 17, 17, 59],
	    [2,  1.0, 1.001e-3, 3,  1.0, 10, 17, 17, 59],
	    [3,  1.0, 1.003e-3, 4,  1.0, 10, 17, 17, 59],
	    [4,  1.0, 1.004e-3, 5,  1.0, 10, 17, 17, 59],
	    [5,  1.0, 1.000e-3, 6,  1.0, 10, 17, 17, 59],
	    [6,  1.0, 0.999e-3, 7,  1.0, 10, 17, 17, 59],
	    [7,  1.0, 1.005e-3, 8,  1.0, 10, 17, 17, 59],
	    [8,  1.0, 1.001e-3, 9,  1.0, 10, 17, 17, 59],
	    [9,  1.0, 0.997e-3, 10, 1.0, 10, 17, 17, 59],
	    [10, 1.0, 1.002e-3, 11, 1.0, 10, 17, 17, 59],
	    [11, 1.0, 1.003e-3, 12, 1.0, 10, 17, 17, 59],
	    [12, 1.0, 1.000e-3, 13, 1.0, 10, 17, 17, 59],
	    [13, 1.0, 1.001e-3, 14, 1.0, 10, 17, 17, 59],
	    [14, 1.0, 1.004e-3, 15, 1.0, 10, 17, 17, 59],
	    [15, 1.0, 0.998e-3, 16, 1.0, 10, 17, 17, 59],
	    [16, 1.0, 1.002e-3, 17, 1.0, 10, 17, 17, 59],
	    [17, 1.0, 1.001e-3, 18, 1.0, 10, 17, 17, 59],
	    [18, 1.0, 1.000e-3, 19, 1.0, 10, 17, 17, 59],
	    [19, 1.0, 0.999e-3, 20, 1.0, 10, 17, 17, 59],
	    [20, 1.0, 1.003e-3, 21, 1.0, 10, 17, 17, 59],
	    [21, 1.0, 1.000e-3, 22, 1.0, 10, 17, 17, 59],
	    [22, 1.0, 1.002e-3, 23, 1.0, 10, 17, 17, 59],
	    [23, 1.0, 0.997e-3, 24, 1.0, 10, 17, 17, 59],

	    [0,  1.0, 1.002e-3,  3, 1.0, 10, 17, 17, 59],
	    [3,  1.0, 0.801e-3, 15, 1.0, 10, 17, 17, 59],
	    [15, 1.0, 0.603e-3, 24, 1.0, 10, 17, 17, 59]
    ]
  }
]

const categoriesToIgnore = [3, 8, 11, 32, 38, 41, 59, 65, 68, 86, 92, 95, 101, 107, 112]
const energyCategories = [3, 8, 9, 32, 38, 39, 59, 65, 66, 86, 92, 93]
const areas = [3, 4, 8, 9, 12, 13, 16, 17, 18]
const thirdParties = [0, 1, 16]  // plus 17 for energy categories

// Disconnected in this version. Only valid for BEGES taxonomy (uses BEGES categories)
const generateDataPoint = (start_time, end_time, time_scale, taxonomy) => {
  // category
  let start, end;

  switch (taxonomy) {
    case "beges":
      start = 23;
      end = 45;
      break;
    case "isotr140692013":
      start = 46;
      end = 69;
      break;
    case "begesv5":
      start = 70;
      end = 91;
      break;
    default:
      //case "ghgprotocol":
      start = 0;
      end = 22;
      break;
  }
  let randomCategory = _.random(start, end)

  // Compute final category, skipping scopes and other non-category 
  // members of the hierarchy.
  for (const ignored of categoriesToIgnore) {
    if (ignored <= randomCategory) {
      randomCategory++;
    } else {
      break; // All further ignored categories will be greater, so we can stop checking
    }
  }

  const randomCompany = _.random(2, 15)
  const randomArea = _.sample(areas)
  const randomAmount = _.random(.0001, 2, true)
  const randomThirdParty = energyCategories.includes(randomCategory) ? 17 : _.sample(thirdParties)
  
  // time 
  const randomSlot = _.random(2, 10)
  const randomDelta = _.random(1, 10)
  
  // synthesis of CDP
  return [
    randomSlot,
    0.4,
    randomAmount,
    randomSlot + randomDelta,
    0.6,
    randomCompany,
    randomArea,
    randomThirdParty,
    randomCategory
  ]
}

const generateData = (start_time, end_time, scale, taxonomy) => {
  let a = 0
  const newDataPoints = []
  while (a < 100) {
    newDataPoints.push(generateDataPoint(start_time, end_time, scale, taxonomy))
    a++
  }
  const resultDataCube = {...emissions_beges[0], data: newDataPoints}
  if (start_time && start_time instanceof Date && !isNaN(start_time)) {
    resultDataCube.time_range.start = start_time
  }
  if (end_time && end_time instanceof Date && !isNaN(end_time)) {
    resultDataCube.time_range.end = end_time
  }
  return [resultDataCube]
}

module.exports.sampleEmissionData = {
  beges: emissions_beges,
  begesv5: emissions_begesv5,
  ghgprotocol: emissions_ghgprotocol,
  isotr140692013: emissions_isotr14069
}
module.exports.appendSomeData = generateData
