export const generalCategoryText =
  "List of relevant categories :"

export const frCategoryMessages: Record<number, string> = {
  /// /// GHG

  // Scope 1
  "3": "Emissions Directes",
  "4": "Ces émissions proviennent de la combustion de carburants dans des équipements fixes tels que les chaudières, les fours, etc.",
  "5": "Ces émissions résultent de la combustion de carburants dans des sources mobiles appartenant à l'organisation, comme les véhicules.",
  "6": "Émissions issues de procédés industriels spécifiques qui ne sont pas liées à la combustion, telles que les réactions chimiques.",
  "7": "Émissions involontaires ou accidentelles, souvent de gaz à effet de serre, qui ne passent pas par un conduit ou une cheminée, comme les fuites de réfrigérants.",

  // Scope 2
  "8": "Emissions Indirectes",
  "9": "Émissions liées à la production de l'électricité achetée et consommée par l'organisation.",
  "10": "Émissions provenant de la consommation de vapeur, de chaleur ou de froid qui sont générées en dehors de l'organisation mais achetées pour un usage interne.",

  // Scope 3
  "11": "Autres Émissions Indirectes",
  "12": "Émissions liées à la production des biens et services achetés par l'organisation.",
  "13": "Émissions découlant de la construction ou de l'achat d'équipements fixes ou d'infrastructures.",
  "14": "Émissions indirectes liées à l'extraction, la production et le transport des combustibles et de l'énergie achetés qui ne sont pas comptabilisés dans les scopes 1 ou 2.",
  "15": "Émissions liées au transport des produits, biens ou services entrants.",
  "16": "Émissions associées à l'élimination des déchets générés dans les opérations de l'organisation.",
  "17": "Émissions résultant des déplacements professionnels effectués par les employés pour le compte de l'entreprise.",
  "18": "Émissions liées aux trajets quotidiens des employés entre leur domicile et leur lieu de travail.",
  "19": "Émissions liées aux actifs loués par l'organisation.",
  "20": "Toutes autres émissions indirectes liées aux activités amont de l'organisation non incluses dans les catégories précédentes.",

  /// / Downstream
  "23": "Émissions liées au transport des produits après leur vente jusqu'au client final.",
  "24": "Émissions résultant de la transformation des produits après leur vente par l'organisation.",
  "25": "Émissions découlant de l'utilisation des produits vendus par l'organisation.",
  "26": "Émissions associées à la fin de vie des produits vendus, y compris le recyclage ou l'élimination.",
  "27": "Émissions liées aux actifs loués aux clients par l'organisation.",
  "28": "Émissions liées aux opérations des franchises.",
  "29": "Émissions liées aux investissements de l'organisation dans d'autres entreprises.",
  "30": "Toutes autres émissions indirectes liées aux activités aval de l'organisation non incluses dans les catégories précédentes.",

  /// /// BEGES
  // Scope 1
  "32": "Émissions Directes",
  "33": "Ces émissions résultent de la combustion de carburants dans des installations fixes telles que chaudières et fours.",
  "34": "Ces émissions proviennent de la combustion de carburants dans des véhicules avec moteurs thermiques appartenant à l'organisation.",
  "35": "Émissions générées par des procédés industriels n'impliquant pas la combustion d'énergie, comme les réactions chimiques spécifiques.",
  "36": "Émissions non intentionnelles s'échappant de systèmes contenant des gaz à effet de serre, comme les systèmes de réfrigération et les fuites de gaz.",
  "37": "Émissions ou absorptions de gaz à effet de serre liées à l'utilisation des terres, au changement d'utilisation des terres et à la foresterie, spécifiquement liées à la biomasse.",

  // Scope 2
  "38": "Émissions Indirectes",
  "39": "Émissions générées par la production de l'électricité achetée et consommée par l'organisation.",
  "40": "Émissions provenant de la consommation d'énergie sous forme de vapeur, de chaleur ou de froid achetés à l'extérieur de l'organisation.",

  // Scope 3
  "41": "Autres Émissions Indirectes",
  "42": "Émissions indirectes liées à la production et au transport de l'énergie achetée non couverte par les scopes 1 et 2.",
  "43": "Émissions résultant de la fabrication des produits et services achetés par l'organisation.",
  "44": "Émissions associées à la production et à l'acquisition d'immobilisations corporelles.",
  "45": "Émissions liées à la gestion des déchets produits par l'organisation.",
  "46": "Émissions provenant du transport des matières premières et autres biens vers l'organisation.",
  "47": "Émissions dues aux déplacements professionnels des employés de l'organisation.",
  "48": "Émissions associées aux biens loués par l'organisation.",
  "49": "Émissions liées aux investissements de l'organisation dans d'autres entités.",
  "50": "Émissions dues au transport des visiteurs et des clients vers et depuis l'organisation.",
  "51": "Émissions résultant du transport des produits de l'organisation vers les clients.",
  "52": "Émissions découlant de l'utilisation des produits vendus par l'organisation.",
  "53": "Émissions associées à l'élimination ou au recyclage des produits vendus par l'organisation.",
  "54": "Émissions liées aux opérations des franchises qui vendent les produits ou services de l'organisation.",
  "55": "Émissions associées aux produits ou équipements loués aux clients par l'organisation.",
  "56": "Émissions dues aux trajets des employés entre leur domicile et leur lieu de travail.",

  /// /// BEGES v5
  "86": "Emissions directes de GES",
  "87": "Ces émissions proviennent de la combustion de carburants dans des installations fixes telles que chaudières et fours.",
  "88": "Émissions issues de la combustion de carburants dans des véhicules ou équipements mobiles appartenant à l'organisation.",
  "89": "Émissions générées par des procédés industriels spécifiques qui ne sont pas liées à la combustion d'énergie.",
  "90": "Émissions involontaires ou accidentelles de gaz à effet de serre, comme les fuites de gaz naturel ou de réfrigérants.",
  "91": "Émissions ou absorptions de CO2 liées à l'utilisation et à la conversion des terres forestières ou agricoles.",

  "92": "Emissions Indirectes Associées à l'Énergie",
  "93": "Émissions résultant de la production d'électricité achetée et consommée par l'organisation.",
  "94": "Émissions dues à la consommation de ces énergies lorsqu'elles sont produites en dehors de l'organisation.",

  "95": "Emissions Indirectes Associées au Transport",
  "96": "Émissions liées au transport des matières premières et autres biens vers l'organisation.",
  "97": "Émissions résultant du transport des produits finis de l'organisation vers les clients.",
  "98": "Émissions dues aux trajets effectués par les employés entre leur domicile et leur lieu de travail.",
  "99": "Émissions générées par le transport des visiteurs et clients se rendant à l'organisation.",
  "100":
    "Émissions liées aux voyages d'affaires effectués par les employés pour le compte de l'organisation.",

  "101": "Emissions Indirectes Associées aux Produits Achetés",
  "102":
    "Émissions liées à la production des biens matériels achetés par l'organisation.",
  "103":
    "Émissions associées à la production et à l'achat d'actifs corporels fixes.",
  "104":
    "Émissions résultant du traitement des déchets produits par l'organisation.",
  "105":
    "Émissions liées aux biens loués par l'organisation pour ses activités.",
  "106":
    "Émissions associées à la prestation de services achetés par l'organisation.",

  "107": "Emissions Indirectes Associées aux Produits Vendus",
  "108":
    "Émissions générées par l'utilisation des produits vendus par l'organisation par les consommateurs finaux.",
  "109":
    "Émissions liées aux produits ou équipements loués aux clients après leur vente.",
  "110":
    "Émissions découlant du traitement des produits en fin de vie, incluant le recyclage et l'élimination.",
  "111":
    "Émissions liées aux investissements de l'organisation dans d'autres entités.",

  "112": "Autres Emissions Indirectes",
  "113":
    "Cette catégorie englobe toutes les autres émissions indirectes non classées dans les catégories précédentes, offrant une flexibilité pour comptabiliser des sources d'émissions diverses et émergentes.",
}
