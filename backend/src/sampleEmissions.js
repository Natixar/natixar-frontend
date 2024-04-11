const _ = require("lodash")

const emissions = [
    {
      time_range: {
        start: "2022-01-01T00:00:00+02:00",
        end: "2024-01-01T00:00:00+02:00",
        step: [
          2678400,
          2419200,
          2678400,
          2592000,
          2678400,
          2592000,
          2678400,
          2678400,
          2592000,
          2678400,
          2592000,
          2678400
        ]
      },
      indexes: {
        entity: [
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
        ],
        area: [
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
        ],
        category: [
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
            name: "beges",
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
            era: ""
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
            era: ""
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
            parent: 41,
            name: "Emissions indirectes associées aux produits vendus",
            code: "5",
            era: ""
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
            parent: 41,
            name: "Autres émissions indirectes",
            code: "6",
            era: ""
          },
          {
            id: 113,
            parent: 112,
            name: "Autres émissions indirectes",
            code: "6-1",
            era: "U"
          }
        ]
      },
      data: [
        [
          0,
          1,
          0.001002,
          1,
          1,
          6,
          18,
          18,
          33
        ],
        [
          1,
          1,
          0.000998,
          2,
          1,
          6,
          18,
          18,
          33
        ],
        [
          2,
          1,
          0.001001,
          3,
          1,
          6,
          18,
          18,
          33
        ],
        [
          3,
          1,
          0.001003,
          4,
          1,
          6,
          18,
          18,
          33
        ],
        [
          4,
          1,
          0.001004,
          5,
          1,
          6,
          18,
          18,
          33
        ],
        [
          5,
          1,
          0.001,
          6,
          1,
          6,
          18,
          18,
          33
        ],
        [
          6,
          1,
          0.000999,
          7,
          1,
          6,
          18,
          18,
          33
        ],
        [
          7,
          1,
          0.001005,
          8,
          1,
          6,
          18,
          18,
          33
        ],
        [
          8,
          1,
          0.001001,
          9,
          1,
          6,
          18,
          18,
          33
        ],
        [
          9,
          1,
          0.000997,
          10,
          1,
          6,
          18,
          18,
          33
        ],
        [
          10,
          1,
          0.001002,
          11,
          1,
          6,
          18,
          18,
          33
        ],
        [
          11,
          1,
          0.001003,
          12,
          1,
          6,
          18,
          18,
          33
        ],
        [
          12,
          1,
          0.001,
          13,
          1,
          6,
          18,
          18,
          33
        ],
        [
          13,
          1,
          0.001001,
          14,
          1,
          6,
          18,
          18,
          33
        ],
        [
          14,
          1,
          0.001004,
          15,
          1,
          6,
          18,
          18,
          33
        ],
        [
          15,
          1,
          0.000998,
          16,
          1,
          6,
          18,
          18,
          33
        ],
        [
          16,
          1,
          0.001002,
          17,
          1,
          6,
          18,
          18,
          33
        ],
        [
          17,
          1,
          0.001001,
          18,
          1,
          6,
          18,
          18,
          33
        ],
        [
          18,
          1,
          0.001,
          19,
          1,
          6,
          18,
          18,
          33
        ],
        [
          19,
          1,
          0.000999,
          20,
          1,
          6,
          18,
          18,
          33
        ],
        [
          20,
          1,
          0.001003,
          21,
          1,
          6,
          18,
          18,
          33
        ],
        [
          21,
          1,
          0.001,
          22,
          1,
          6,
          18,
          18,
          33
        ],
        [
          22,
          1,
          0.001002,
          23,
          1,
          6,
          18,
          18,
          33
        ],
        [
          23,
          1,
          0.000997,
          24,
          1,
          6,
          18,
          18,
          33
        ],
        [
          0,
          1,
          0.001002,
          3,
          1,
          6,
          18,
          18,
          33
        ],
        [
          3,
          1,
          0.001001,
          15,
          1,
          6,
          18,
          18,
          33
        ],
        [
          15,
          1,
          0.001003,
          24,
          1,
          6,
          18,
          18,
          33
        ]
      ]
    }
  ]

const categoriesToIgnore = [32, 38, 41]
const areas = [4, 5, 9, 10, 12, 13, 16, 17, 18]

const generateDataPoint = () => {
  const randomCompany = _.random(1, 18)
  const randomArea = _.sample(areas)
  const randomBegesCategory = _.random(32, 56)
  const randomAmount = _.random(.0001, 2, true)
  const randomSlot = _.random(2, 10)
  const randomDelta = _.random(1, 10)
  return [
    randomSlot,
    0.4,
    randomAmount,
    randomSlot + randomDelta,
    0.6,
    randomCompany,
    randomArea,
    18,
    categoriesToIgnore.includes(randomBegesCategory) ? randomBegesCategory + 1 : randomBegesCategory
  ]
}

const generateData = (start, end) => {
  let a = 0
  const newDataPoints = []
  while (a < 100) {
    newDataPoints.push(generateDataPoint())
    a++
  }
  const resultDataCube = {...emissions[0], data: newDataPoints}
  if (start && start instanceof Date && !isNaN(start)) {
    resultDataCube.time_range.start = start
  }
  if (end && end instanceof Date && !isNaN(end)) {
    resultDataCube.time_range.end = end
  }
  return [resultDataCube]
}

module.exports.sampleEmissionData = emissions
module.exports.appendSomeData = generateData