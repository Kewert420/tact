'use strict';const ohm=require('ohm-js');const result=ohm.makeRecipe(["grammar",{"source":"Tact {\n\n    // Starting point of the program\n    Program = ProgramItem*\n    ProgramItem = Struct\n                | Contract\n                | Primitive\n                | StaticFunction\n                | NativeFunction\n\n    // Built-in declarations\n    Primitive = primitive Type \";\"\n\n    // Static function\n    StaticFunction = Function\n    NativeFunction = nameAttribute \"(\" id \")\" native id \"(\" ListOf<FunctionArg,\",\"> \")\" \";\" --withVoid\n                   | nameAttribute \"(\" id \")\" native id \"(\" ListOf<FunctionArg,\",\"> \")\" \":\" Type \";\" --withType\n    \n    // Field declarations\n    Type = typeLiteral \"?\" --optional\n         | typeLiteral --required\n    Field = id \":\" Type \";\"\n\n    // Struct\n    Struct = struct id \"{\" StructBody* \"}\"\n    StructBody = Field\n\n    // Contract\n    Contract = contract id \"{\" ContractBody* \"}\"\n    ContractInit = init \"(\" ListOf<FunctionArg,\",\"> \")\" \"{\" Statement* \"}\"\n    ContractBody = Field\n                 | ContractInit\n                 | Function \n\n    // Function\n    FunctionAttribute = public --public\n                      | get    --getter\n    Function = ListOf<FunctionAttribute,\" \"> fun id \"(\" ListOf<FunctionArg,\",\"> \")\" \"{\" Statement* \"}\" --withVoid\n             | ListOf<FunctionAttribute,\" \"> fun id \"(\" ListOf<FunctionArg,\",\"> \")\" \":\" Type \"{\" Statement* \"}\" --withType\n             \n    FunctionArg = id \":\" Type\n\n    // Statements\n    Statement = StatementLet\n              | StatementBlock\n              | StatementReturn\n              | StatementCall\n              | StatementStaticCall\n              | StatementAssign\n              | StatementCondition\n    StatementBlock = \"{\" Statement* \"}\"\n    StatementLet = let id \":\" Type \"=\" Expression \";\"\n    StatementReturn = return Expression \";\"\n    StatementCall = ExpressionCall \";\"\n    StatementStaticCall = ExpressionStaticCall \";\"\n    StatementAssign = LValue Expression \";\"\n    StatementCondition = if Expression \"{\" Statement* \"}\" ~else --simple\n                       | if Expression \"{\" Statement* \"}\" else \"{\" Statement* \"}\" --withElse\n                       | if Expression \"{\" Statement* \"}\" else StatementCondition --withElseIf\n\n    // L-value\n    LValue = id \"=\" --id\n           | id \".\" LValue --subId\n\n    // Expressions\n    Expression = ExpressionOr\n    ExpressionOr = ExpressionOr \"||\" ExpressionAnd --or\n                 | ExpressionAnd\n    ExpressionAnd = ExpressionAnd \"&&\" ExpressionCompare --and\n                  | ExpressionCompare\n    ExpressionCompare = ExpressionCompare \"!=\" ExpressionAdd --not\n                      | ExpressionCompare \"==\" ExpressionAdd --eq\n                      | ExpressionCompare \">\" ExpressionAdd --gt\n                      | ExpressionCompare \">=\" ExpressionAdd --gte\n                      | ExpressionCompare \"<\" ExpressionAdd --lt\n                      | ExpressionCompare \"<=\" ExpressionAdd --lte\n                      | ExpressionAdd\n    ExpressionAdd = ExpressionAdd \"+\" ~\"+\" ExpressionMul --add\n                  | ExpressionAdd \"-\" ~\"-\" ExpressionMul --sub\n                  | ExpressionMul\n    ExpressionMul = ExpressionMul \"*\" ExpressionUnary --mul\n                  | ExpressionMul \"/\" ExpressionUnary --div\n                  | ExpressionUnary\n    ExpressionUnary = \"-\" ExpressionUnarySuffix --neg\n                    | \"+\" ExpressionUnarySuffix --add\n                    | \"!\" ExpressionUnarySuffix --not\n                    | ExpressionUnarySuffix\n    ExpressionUnarySuffix = ExpressionValue \"!!\" --notNull\n                          | ExpressionValue\n    ExpressionBracket = \"(\" Expression \")\"\n\n    // Order is important\n    ExpressionValue = ExpressionCall\n                    | ExpressionField\n                    | ExpressionStaticCall\n                    | ExpressionBracket\n                    | ExpressionNew\n                    | integerLiteral\n                    | boolLiteral\n                    | id\n                    | null\n                    \n    ExpressionField = ExpressionValue \".\" id\n    ExpressionCall = ExpressionValue \".\" id \"(\" ListOf<Expression, \",\"> \")\"\n    ExpressionNew = id \"{\" ListOf<NewParameter, \",\"> \"}\"\n    NewParameter = id \":\" Expression\n    ExpressionStaticCall = ExpressionValue \"(\" ListOf<Expression, \",\"> \")\"\n\n    // Type Literal\n    typeLiteral = letterAsciiUC typeLiteralPart*\n    typeLiteralPart = letterAscii | digit | \"_\"\n\n    // Integer Literal\n    // hexDigit defined in Ohm's built-in rules (otherwise: hexDigit = \"0\"..\"9\" | \"a\"..\"f\" | \"A\"..\"F\")\n    // digit defined in Ohm's built-in rules (otherwise: digit = \"0\"..\"9\")\n    integerLiteral = integerLiteralHex | integerLiteralDec // Order is important\n    integerLiteralDec = digit+\n    integerLiteralHex = \"0x\" hexDigit+\n                      | \"0X\" hexDigit+\n\n    // Letters\n    letterAsciiLC = \"a\"..\"z\"\n    letterAsciiUC = \"A\"..\"Z\"\n    letterAscii = letterAsciiLC | letterAsciiUC\n\n    // ID Literal\n    idStart = letterAscii | \"_\"\n    idPart = letterAscii | digit | \"_\"\n    id = ~reservedWord idStart idPart*\n\n    // Bool Literal\n    boolLiteral = (\"true\" | \"false\") ~idPart\n\n    // Keywords\n    keyword = struct | contract | fun | let | return | primitive | extend | native | public | get | null | if | else | init // Order is important\n    struct = \"struct\" ~idPart\n    contract = \"contract\" ~idPart\n    let = \"let\" ~idPart\n    fun = \"fun\" ~idPart\n    return = \"return\" ~idPart\n    primitive = \"primitive\" ~idPart\n    extend = \"extend\" ~idPart\n    native = \"native\" ~idPart\n    public = \"public\" ~idPart\n    null = \"null\" ~idPart\n    get = \"get\" ~idPart\n    if = \"if\" ~idPart\n    else = \"else\" ~idPart\n    init = \"init\" ~idPart\n\n    // Attributes\n    nameAttribute = \"@name\"\n\n    // Reserved\n    reservedWord = keyword\n}"},"Tact",null,"Program",{"Program":["define",{"sourceInterval":[49,71]},null,[],["star",{"sourceInterval":[59,71]},["app",{"sourceInterval":[59,70]},"ProgramItem",[]]]],"ProgramItem":["define",{"sourceInterval":[76,217]},null,[],["alt",{"sourceInterval":[90,217]},["app",{"sourceInterval":[90,96]},"Struct",[]],["app",{"sourceInterval":[115,123]},"Contract",[]],["app",{"sourceInterval":[142,151]},"Primitive",[]],["app",{"sourceInterval":[170,184]},"StaticFunction",[]],["app",{"sourceInterval":[203,217]},"NativeFunction",[]]]],"Primitive":["define",{"sourceInterval":[252,282]},null,[],["seq",{"sourceInterval":[264,282]},["app",{"sourceInterval":[264,273]},"primitive",[]],["app",{"sourceInterval":[274,278]},"Type",[]],["terminal",{"sourceInterval":[279,282]},";"]]],"StaticFunction":["define",{"sourceInterval":[311,336]},null,[],["app",{"sourceInterval":[328,336]},"Function",[]]],"NativeFunction_withVoid":["define",{"sourceInterval":[358,439]},null,[],["seq",{"sourceInterval":[358,428]},["app",{"sourceInterval":[358,371]},"nameAttribute",[]],["terminal",{"sourceInterval":[372,375]},"("],["app",{"sourceInterval":[376,378]},"id",[]],["terminal",{"sourceInterval":[379,382]},")"],["app",{"sourceInterval":[383,389]},"native",[]],["app",{"sourceInterval":[390,392]},"id",[]],["terminal",{"sourceInterval":[393,396]},"("],["app",{"sourceInterval":[397,420]},"ListOf",[["app",{"sourceInterval":[404,415]},"FunctionArg",[]],["terminal",{"sourceInterval":[416,419]},","]]],["terminal",{"sourceInterval":[421,424]},")"],["terminal",{"sourceInterval":[425,428]},";"]]],"NativeFunction_withType":["define",{"sourceInterval":[461,551]},null,[],["seq",{"sourceInterval":[461,540]},["app",{"sourceInterval":[461,474]},"nameAttribute",[]],["terminal",{"sourceInterval":[475,478]},"("],["app",{"sourceInterval":[479,481]},"id",[]],["terminal",{"sourceInterval":[482,485]},")"],["app",{"sourceInterval":[486,492]},"native",[]],["app",{"sourceInterval":[493,495]},"id",[]],["terminal",{"sourceInterval":[496,499]},"("],["app",{"sourceInterval":[500,523]},"ListOf",[["app",{"sourceInterval":[507,518]},"FunctionArg",[]],["terminal",{"sourceInterval":[519,522]},","]]],["terminal",{"sourceInterval":[524,527]},")"],["terminal",{"sourceInterval":[528,531]},":"],["app",{"sourceInterval":[532,536]},"Type",[]],["terminal",{"sourceInterval":[537,540]},";"]]],"NativeFunction":["define",{"sourceInterval":[341,551]},null,[],["alt",{"sourceInterval":[358,551]},["app",{"sourceInterval":[358,428]},"NativeFunction_withVoid",[]],["app",{"sourceInterval":[461,540]},"NativeFunction_withType",[]]]],"Type_optional":["define",{"sourceInterval":[594,620]},null,[],["seq",{"sourceInterval":[594,609]},["app",{"sourceInterval":[594,605]},"typeLiteral",[]],["terminal",{"sourceInterval":[606,609]},"?"]]],"Type_required":["define",{"sourceInterval":[632,654]},null,[],["app",{"sourceInterval":[632,643]},"typeLiteral",[]]],"Type":["define",{"sourceInterval":[587,654]},null,[],["alt",{"sourceInterval":[594,654]},["app",{"sourceInterval":[594,609]},"Type_optional",[]],["app",{"sourceInterval":[632,643]},"Type_required",[]]]],"Field":["define",{"sourceInterval":[659,682]},null,[],["seq",{"sourceInterval":[667,682]},["app",{"sourceInterval":[667,669]},"id",[]],["terminal",{"sourceInterval":[670,673]},":"],["app",{"sourceInterval":[674,678]},"Type",[]],["terminal",{"sourceInterval":[679,682]},";"]]],"Struct":["define",{"sourceInterval":[702,740]},null,[],["seq",{"sourceInterval":[711,740]},["app",{"sourceInterval":[711,717]},"struct",[]],["app",{"sourceInterval":[718,720]},"id",[]],["terminal",{"sourceInterval":[721,724]},"{"],["star",{"sourceInterval":[725,736]},["app",{"sourceInterval":[725,735]},"StructBody",[]]],["terminal",{"sourceInterval":[737,740]},"}"]]],"StructBody":["define",{"sourceInterval":[745,763]},null,[],["app",{"sourceInterval":[758,763]},"Field",[]]],"Contract":["define",{"sourceInterval":[785,829]},null,[],["seq",{"sourceInterval":[796,829]},["app",{"sourceInterval":[796,804]},"contract",[]],["app",{"sourceInterval":[805,807]},"id",[]],["terminal",{"sourceInterval":[808,811]},"{"],["star",{"sourceInterval":[812,825]},["app",{"sourceInterval":[812,824]},"ContractBody",[]]],["terminal",{"sourceInterval":[826,829]},"}"]]],"ContractInit":["define",{"sourceInterval":[834,904]},null,[],["seq",{"sourceInterval":[849,904]},["app",{"sourceInterval":[849,853]},"init",[]],["terminal",{"sourceInterval":[854,857]},"("],["app",{"sourceInterval":[858,881]},"ListOf",[["app",{"sourceInterval":[865,876]},"FunctionArg",[]],["terminal",{"sourceInterval":[877,880]},","]]],["terminal",{"sourceInterval":[882,885]},")"],["terminal",{"sourceInterval":[886,889]},"{"],["star",{"sourceInterval":[890,900]},["app",{"sourceInterval":[890,899]},"Statement",[]]],["terminal",{"sourceInterval":[901,904]},"}"]]],"ContractBody":["define",{"sourceInterval":[909,989]},null,[],["alt",{"sourceInterval":[924,989]},["app",{"sourceInterval":[924,929]},"Field",[]],["app",{"sourceInterval":[949,961]},"ContractInit",[]],["app",{"sourceInterval":[981,989]},"Function",[]]]],"FunctionAttribute_public":["define",{"sourceInterval":[1032,1047]},null,[],["app",{"sourceInterval":[1032,1038]},"public",[]]],"FunctionAttribute_getter":["define",{"sourceInterval":[1072,1087]},null,[],["app",{"sourceInterval":[1072,1075]},"get",[]]],"FunctionAttribute":["define",{"sourceInterval":[1012,1087]},null,[],["alt",{"sourceInterval":[1032,1087]},["app",{"sourceInterval":[1032,1038]},"FunctionAttribute_public",[]],["app",{"sourceInterval":[1072,1075]},"FunctionAttribute_getter",[]]]],"Function_withVoid":["define",{"sourceInterval":[1103,1201]},null,[],["seq",{"sourceInterval":[1103,1190]},["app",{"sourceInterval":[1103,1132]},"ListOf",[["app",{"sourceInterval":[1110,1127]},"FunctionAttribute",[]],["terminal",{"sourceInterval":[1128,1131]}," "]]],["app",{"sourceInterval":[1133,1136]},"fun",[]],["app",{"sourceInterval":[1137,1139]},"id",[]],["terminal",{"sourceInterval":[1140,1143]},"("],["app",{"sourceInterval":[1144,1167]},"ListOf",[["app",{"sourceInterval":[1151,1162]},"FunctionArg",[]],["terminal",{"sourceInterval":[1163,1166]},","]]],["terminal",{"sourceInterval":[1168,1171]},")"],["terminal",{"sourceInterval":[1172,1175]},"{"],["star",{"sourceInterval":[1176,1186]},["app",{"sourceInterval":[1176,1185]},"Statement",[]]],["terminal",{"sourceInterval":[1187,1190]},"}"]]],"Function_withType":["define",{"sourceInterval":[1217,1324]},null,[],["seq",{"sourceInterval":[1217,1313]},["app",{"sourceInterval":[1217,1246]},"ListOf",[["app",{"sourceInterval":[1224,1241]},"FunctionAttribute",[]],["terminal",{"sourceInterval":[1242,1245]}," "]]],["app",{"sourceInterval":[1247,1250]},"fun",[]],["app",{"sourceInterval":[1251,1253]},"id",[]],["terminal",{"sourceInterval":[1254,1257]},"("],["app",{"sourceInterval":[1258,1281]},"ListOf",[["app",{"sourceInterval":[1265,1276]},"FunctionArg",[]],["terminal",{"sourceInterval":[1277,1280]},","]]],["terminal",{"sourceInterval":[1282,1285]},")"],["terminal",{"sourceInterval":[1286,1289]},":"],["app",{"sourceInterval":[1290,1294]},"Type",[]],["terminal",{"sourceInterval":[1295,1298]},"{"],["star",{"sourceInterval":[1299,1309]},["app",{"sourceInterval":[1299,1308]},"Statement",[]]],["terminal",{"sourceInterval":[1310,1313]},"}"]]],"Function":["define",{"sourceInterval":[1092,1324]},null,[],["alt",{"sourceInterval":[1103,1324]},["app",{"sourceInterval":[1103,1190]},"Function_withVoid",[]],["app",{"sourceInterval":[1217,1313]},"Function_withType",[]]]],"FunctionArg":["define",{"sourceInterval":[1343,1368]},null,[],["seq",{"sourceInterval":[1357,1368]},["app",{"sourceInterval":[1357,1359]},"id",[]],["terminal",{"sourceInterval":[1360,1363]},":"],["app",{"sourceInterval":[1364,1368]},"Type",[]]]],"Statement":["define",{"sourceInterval":[1392,1612]},null,[],["alt",{"sourceInterval":[1404,1612]},["app",{"sourceInterval":[1404,1416]},"StatementLet",[]],["app",{"sourceInterval":[1433,1447]},"StatementBlock",[]],["app",{"sourceInterval":[1464,1479]},"StatementReturn",[]],["app",{"sourceInterval":[1496,1509]},"StatementCall",[]],["app",{"sourceInterval":[1526,1545]},"StatementStaticCall",[]],["app",{"sourceInterval":[1562,1577]},"StatementAssign",[]],["app",{"sourceInterval":[1594,1612]},"StatementCondition",[]]]],"StatementBlock":["define",{"sourceInterval":[1617,1652]},null,[],["seq",{"sourceInterval":[1634,1652]},["terminal",{"sourceInterval":[1634,1637]},"{"],["star",{"sourceInterval":[1638,1648]},["app",{"sourceInterval":[1638,1647]},"Statement",[]]],["terminal",{"sourceInterval":[1649,1652]},"}"]]],"StatementLet":["define",{"sourceInterval":[1657,1706]},null,[],["seq",{"sourceInterval":[1672,1706]},["app",{"sourceInterval":[1672,1675]},"let",[]],["app",{"sourceInterval":[1676,1678]},"id",[]],["terminal",{"sourceInterval":[1679,1682]},":"],["app",{"sourceInterval":[1683,1687]},"Type",[]],["terminal",{"sourceInterval":[1688,1691]},"="],["app",{"sourceInterval":[1692,1702]},"Expression",[]],["terminal",{"sourceInterval":[1703,1706]},";"]]],"StatementReturn":["define",{"sourceInterval":[1711,1750]},null,[],["seq",{"sourceInterval":[1729,1750]},["app",{"sourceInterval":[1729,1735]},"return",[]],["app",{"sourceInterval":[1736,1746]},"Expression",[]],["terminal",{"sourceInterval":[1747,1750]},";"]]],"StatementCall":["define",{"sourceInterval":[1755,1789]},null,[],["seq",{"sourceInterval":[1771,1789]},["app",{"sourceInterval":[1771,1785]},"ExpressionCall",[]],["terminal",{"sourceInterval":[1786,1789]},";"]]],"StatementStaticCall":["define",{"sourceInterval":[1794,1840]},null,[],["seq",{"sourceInterval":[1816,1840]},["app",{"sourceInterval":[1816,1836]},"ExpressionStaticCall",[]],["terminal",{"sourceInterval":[1837,1840]},";"]]],"StatementAssign":["define",{"sourceInterval":[1845,1884]},null,[],["seq",{"sourceInterval":[1863,1884]},["app",{"sourceInterval":[1863,1869]},"LValue",[]],["app",{"sourceInterval":[1870,1880]},"Expression",[]],["terminal",{"sourceInterval":[1881,1884]},";"]]],"StatementCondition_simple":["define",{"sourceInterval":[1910,1957]},null,[],["seq",{"sourceInterval":[1910,1948]},["app",{"sourceInterval":[1910,1912]},"if",[]],["app",{"sourceInterval":[1913,1923]},"Expression",[]],["terminal",{"sourceInterval":[1924,1927]},"{"],["star",{"sourceInterval":[1928,1938]},["app",{"sourceInterval":[1928,1937]},"Statement",[]]],["terminal",{"sourceInterval":[1939,1942]},"}"],["not",{"sourceInterval":[1943,1948]},["app",{"sourceInterval":[1944,1948]},"else",[]]]]],"StatementCondition_withElse":["define",{"sourceInterval":[1983,2050]},null,[],["seq",{"sourceInterval":[1983,2039]},["app",{"sourceInterval":[1983,1985]},"if",[]],["app",{"sourceInterval":[1986,1996]},"Expression",[]],["terminal",{"sourceInterval":[1997,2000]},"{"],["star",{"sourceInterval":[2001,2011]},["app",{"sourceInterval":[2001,2010]},"Statement",[]]],["terminal",{"sourceInterval":[2012,2015]},"}"],["app",{"sourceInterval":[2016,2020]},"else",[]],["terminal",{"sourceInterval":[2021,2024]},"{"],["star",{"sourceInterval":[2025,2035]},["app",{"sourceInterval":[2025,2034]},"Statement",[]]],["terminal",{"sourceInterval":[2036,2039]},"}"]]],"StatementCondition_withElseIf":["define",{"sourceInterval":[2076,2145]},null,[],["seq",{"sourceInterval":[2076,2132]},["app",{"sourceInterval":[2076,2078]},"if",[]],["app",{"sourceInterval":[2079,2089]},"Expression",[]],["terminal",{"sourceInterval":[2090,2093]},"{"],["star",{"sourceInterval":[2094,2104]},["app",{"sourceInterval":[2094,2103]},"Statement",[]]],["terminal",{"sourceInterval":[2105,2108]},"}"],["app",{"sourceInterval":[2109,2113]},"else",[]],["app",{"sourceInterval":[2114,2132]},"StatementCondition",[]]]],"StatementCondition":["define",{"sourceInterval":[1889,2145]},null,[],["alt",{"sourceInterval":[1910,2145]},["app",{"sourceInterval":[1910,1948]},"StatementCondition_simple",[]],["app",{"sourceInterval":[1983,2039]},"StatementCondition_withElse",[]],["app",{"sourceInterval":[2076,2132]},"StatementCondition_withElseIf",[]]]],"LValue_id":["define",{"sourceInterval":[2175,2186]},null,[],["seq",{"sourceInterval":[2175,2181]},["app",{"sourceInterval":[2175,2177]},"id",[]],["terminal",{"sourceInterval":[2178,2181]},"="]]],"LValue_subId":["define",{"sourceInterval":[2200,2221]},null,[],["seq",{"sourceInterval":[2200,2213]},["app",{"sourceInterval":[2200,2202]},"id",[]],["terminal",{"sourceInterval":[2203,2206]},"."],["app",{"sourceInterval":[2207,2213]},"LValue",[]]]],"LValue":["define",{"sourceInterval":[2166,2221]},null,[],["alt",{"sourceInterval":[2175,2221]},["app",{"sourceInterval":[2175,2181]},"LValue_id",[]],["app",{"sourceInterval":[2200,2213]},"LValue_subId",[]]]],"Expression":["define",{"sourceInterval":[2246,2271]},null,[],["app",{"sourceInterval":[2259,2271]},"ExpressionOr",[]]],"ExpressionOr_or":["define",{"sourceInterval":[2291,2327]},null,[],["seq",{"sourceInterval":[2291,2322]},["app",{"sourceInterval":[2291,2303]},"ExpressionOr",[]],["terminal",{"sourceInterval":[2304,2308]},"||"],["app",{"sourceInterval":[2309,2322]},"ExpressionAnd",[]]]],"ExpressionOr":["define",{"sourceInterval":[2276,2360]},null,[],["alt",{"sourceInterval":[2291,2360]},["app",{"sourceInterval":[2291,2322]},"ExpressionOr_or",[]],["app",{"sourceInterval":[2347,2360]},"ExpressionAnd",[]]]],"ExpressionAnd_and":["define",{"sourceInterval":[2381,2423]},null,[],["seq",{"sourceInterval":[2381,2417]},["app",{"sourceInterval":[2381,2394]},"ExpressionAnd",[]],["terminal",{"sourceInterval":[2395,2399]},"&&"],["app",{"sourceInterval":[2400,2417]},"ExpressionCompare",[]]]],"ExpressionAnd":["define",{"sourceInterval":[2365,2461]},null,[],["alt",{"sourceInterval":[2381,2461]},["app",{"sourceInterval":[2381,2417]},"ExpressionAnd_and",[]],["app",{"sourceInterval":[2444,2461]},"ExpressionCompare",[]]]],"ExpressionCompare_not":["define",{"sourceInterval":[2486,2528]},null,[],["seq",{"sourceInterval":[2486,2522]},["app",{"sourceInterval":[2486,2503]},"ExpressionCompare",[]],["terminal",{"sourceInterval":[2504,2508]},"!="],["app",{"sourceInterval":[2509,2522]},"ExpressionAdd",[]]]],"ExpressionCompare_eq":["define",{"sourceInterval":[2553,2594]},null,[],["seq",{"sourceInterval":[2553,2589]},["app",{"sourceInterval":[2553,2570]},"ExpressionCompare",[]],["terminal",{"sourceInterval":[2571,2575]},"=="],["app",{"sourceInterval":[2576,2589]},"ExpressionAdd",[]]]],"ExpressionCompare_gt":["define",{"sourceInterval":[2619,2659]},null,[],["seq",{"sourceInterval":[2619,2654]},["app",{"sourceInterval":[2619,2636]},"ExpressionCompare",[]],["terminal",{"sourceInterval":[2637,2640]},">"],["app",{"sourceInterval":[2641,2654]},"ExpressionAdd",[]]]],"ExpressionCompare_gte":["define",{"sourceInterval":[2684,2726]},null,[],["seq",{"sourceInterval":[2684,2720]},["app",{"sourceInterval":[2684,2701]},"ExpressionCompare",[]],["terminal",{"sourceInterval":[2702,2706]},">="],["app",{"sourceInterval":[2707,2720]},"ExpressionAdd",[]]]],"ExpressionCompare_lt":["define",{"sourceInterval":[2751,2791]},null,[],["seq",{"sourceInterval":[2751,2786]},["app",{"sourceInterval":[2751,2768]},"ExpressionCompare",[]],["terminal",{"sourceInterval":[2769,2772]},"<"],["app",{"sourceInterval":[2773,2786]},"ExpressionAdd",[]]]],"ExpressionCompare_lte":["define",{"sourceInterval":[2816,2858]},null,[],["seq",{"sourceInterval":[2816,2852]},["app",{"sourceInterval":[2816,2833]},"ExpressionCompare",[]],["terminal",{"sourceInterval":[2834,2838]},"<="],["app",{"sourceInterval":[2839,2852]},"ExpressionAdd",[]]]],"ExpressionCompare":["define",{"sourceInterval":[2466,2896]},null,[],["alt",{"sourceInterval":[2486,2896]},["app",{"sourceInterval":[2486,2522]},"ExpressionCompare_not",[]],["app",{"sourceInterval":[2553,2589]},"ExpressionCompare_eq",[]],["app",{"sourceInterval":[2619,2654]},"ExpressionCompare_gt",[]],["app",{"sourceInterval":[2684,2720]},"ExpressionCompare_gte",[]],["app",{"sourceInterval":[2751,2786]},"ExpressionCompare_lt",[]],["app",{"sourceInterval":[2816,2852]},"ExpressionCompare_lte",[]],["app",{"sourceInterval":[2883,2896]},"ExpressionAdd",[]]]],"ExpressionAdd_add":["define",{"sourceInterval":[2917,2959]},null,[],["seq",{"sourceInterval":[2917,2953]},["app",{"sourceInterval":[2917,2930]},"ExpressionAdd",[]],["terminal",{"sourceInterval":[2931,2934]},"+"],["not",{"sourceInterval":[2935,2939]},["terminal",{"sourceInterval":[2936,2939]},"+"]],["app",{"sourceInterval":[2940,2953]},"ExpressionMul",[]]]],"ExpressionAdd_sub":["define",{"sourceInterval":[2980,3022]},null,[],["seq",{"sourceInterval":[2980,3016]},["app",{"sourceInterval":[2980,2993]},"ExpressionAdd",[]],["terminal",{"sourceInterval":[2994,2997]},"-"],["not",{"sourceInterval":[2998,3002]},["terminal",{"sourceInterval":[2999,3002]},"-"]],["app",{"sourceInterval":[3003,3016]},"ExpressionMul",[]]]],"ExpressionAdd":["define",{"sourceInterval":[2901,3056]},null,[],["alt",{"sourceInterval":[2917,3056]},["app",{"sourceInterval":[2917,2953]},"ExpressionAdd_add",[]],["app",{"sourceInterval":[2980,3016]},"ExpressionAdd_sub",[]],["app",{"sourceInterval":[3043,3056]},"ExpressionMul",[]]]],"ExpressionMul_mul":["define",{"sourceInterval":[3077,3116]},null,[],["seq",{"sourceInterval":[3077,3110]},["app",{"sourceInterval":[3077,3090]},"ExpressionMul",[]],["terminal",{"sourceInterval":[3091,3094]},"*"],["app",{"sourceInterval":[3095,3110]},"ExpressionUnary",[]]]],"ExpressionMul_div":["define",{"sourceInterval":[3137,3176]},null,[],["seq",{"sourceInterval":[3137,3170]},["app",{"sourceInterval":[3137,3150]},"ExpressionMul",[]],["terminal",{"sourceInterval":[3151,3154]},"/"],["app",{"sourceInterval":[3155,3170]},"ExpressionUnary",[]]]],"ExpressionMul":["define",{"sourceInterval":[3061,3212]},null,[],["alt",{"sourceInterval":[3077,3212]},["app",{"sourceInterval":[3077,3110]},"ExpressionMul_mul",[]],["app",{"sourceInterval":[3137,3170]},"ExpressionMul_div",[]],["app",{"sourceInterval":[3197,3212]},"ExpressionUnary",[]]]],"ExpressionUnary_neg":["define",{"sourceInterval":[3235,3266]},null,[],["seq",{"sourceInterval":[3235,3260]},["terminal",{"sourceInterval":[3235,3238]},"-"],["app",{"sourceInterval":[3239,3260]},"ExpressionUnarySuffix",[]]]],"ExpressionUnary_add":["define",{"sourceInterval":[3289,3320]},null,[],["seq",{"sourceInterval":[3289,3314]},["terminal",{"sourceInterval":[3289,3292]},"+"],["app",{"sourceInterval":[3293,3314]},"ExpressionUnarySuffix",[]]]],"ExpressionUnary_not":["define",{"sourceInterval":[3343,3374]},null,[],["seq",{"sourceInterval":[3343,3368]},["terminal",{"sourceInterval":[3343,3346]},"!"],["app",{"sourceInterval":[3347,3368]},"ExpressionUnarySuffix",[]]]],"ExpressionUnary":["define",{"sourceInterval":[3217,3418]},null,[],["alt",{"sourceInterval":[3235,3418]},["app",{"sourceInterval":[3235,3260]},"ExpressionUnary_neg",[]],["app",{"sourceInterval":[3289,3314]},"ExpressionUnary_add",[]],["app",{"sourceInterval":[3343,3368]},"ExpressionUnary_not",[]],["app",{"sourceInterval":[3397,3418]},"ExpressionUnarySuffix",[]]]],"ExpressionUnarySuffix_notNull":["define",{"sourceInterval":[3447,3477]},null,[],["seq",{"sourceInterval":[3447,3467]},["app",{"sourceInterval":[3447,3462]},"ExpressionValue",[]],["terminal",{"sourceInterval":[3463,3467]},"!!"]]],"ExpressionUnarySuffix":["define",{"sourceInterval":[3423,3521]},null,[],["alt",{"sourceInterval":[3447,3521]},["app",{"sourceInterval":[3447,3467]},"ExpressionUnarySuffix_notNull",[]],["app",{"sourceInterval":[3506,3521]},"ExpressionValue",[]]]],"ExpressionBracket":["define",{"sourceInterval":[3526,3564]},null,[],["seq",{"sourceInterval":[3546,3564]},["terminal",{"sourceInterval":[3546,3549]},"("],["app",{"sourceInterval":[3550,3560]},"Expression",[]],["terminal",{"sourceInterval":[3561,3564]},")"]]],"ExpressionValue":["define",{"sourceInterval":[3596,3908]},null,[],["alt",{"sourceInterval":[3614,3908]},["app",{"sourceInterval":[3614,3628]},"ExpressionCall",[]],["app",{"sourceInterval":[3651,3666]},"ExpressionField",[]],["app",{"sourceInterval":[3689,3709]},"ExpressionStaticCall",[]],["app",{"sourceInterval":[3732,3749]},"ExpressionBracket",[]],["app",{"sourceInterval":[3772,3785]},"ExpressionNew",[]],["app",{"sourceInterval":[3808,3822]},"integerLiteral",[]],["app",{"sourceInterval":[3845,3856]},"boolLiteral",[]],["app",{"sourceInterval":[3879,3881]},"id",[]],["app",{"sourceInterval":[3904,3908]},"null",[]]]],"ExpressionField":["define",{"sourceInterval":[3934,3974]},null,[],["seq",{"sourceInterval":[3952,3974]},["app",{"sourceInterval":[3952,3967]},"ExpressionValue",[]],["terminal",{"sourceInterval":[3968,3971]},"."],["app",{"sourceInterval":[3972,3974]},"id",[]]]],"ExpressionCall":["define",{"sourceInterval":[3979,4050]},null,[],["seq",{"sourceInterval":[3996,4050]},["app",{"sourceInterval":[3996,4011]},"ExpressionValue",[]],["terminal",{"sourceInterval":[4012,4015]},"."],["app",{"sourceInterval":[4016,4018]},"id",[]],["terminal",{"sourceInterval":[4019,4022]},"("],["app",{"sourceInterval":[4023,4046]},"ListOf",[["app",{"sourceInterval":[4030,4040]},"Expression",[]],["terminal",{"sourceInterval":[4042,4045]},","]]],["terminal",{"sourceInterval":[4047,4050]},")"]]],"ExpressionNew":["define",{"sourceInterval":[4055,4107]},null,[],["seq",{"sourceInterval":[4071,4107]},["app",{"sourceInterval":[4071,4073]},"id",[]],["terminal",{"sourceInterval":[4074,4077]},"{"],["app",{"sourceInterval":[4078,4103]},"ListOf",[["app",{"sourceInterval":[4085,4097]},"NewParameter",[]],["terminal",{"sourceInterval":[4099,4102]},","]]],["terminal",{"sourceInterval":[4104,4107]},"}"]]],"NewParameter":["define",{"sourceInterval":[4112,4144]},null,[],["seq",{"sourceInterval":[4127,4144]},["app",{"sourceInterval":[4127,4129]},"id",[]],["terminal",{"sourceInterval":[4130,4133]},":"],["app",{"sourceInterval":[4134,4144]},"Expression",[]]]],"ExpressionStaticCall":["define",{"sourceInterval":[4149,4219]},null,[],["seq",{"sourceInterval":[4172,4219]},["app",{"sourceInterval":[4172,4187]},"ExpressionValue",[]],["terminal",{"sourceInterval":[4188,4191]},"("],["app",{"sourceInterval":[4192,4215]},"ListOf",[["app",{"sourceInterval":[4199,4209]},"Expression",[]],["terminal",{"sourceInterval":[4211,4214]},","]]],["terminal",{"sourceInterval":[4216,4219]},")"]]],"typeLiteral":["define",{"sourceInterval":[4245,4289]},null,[],["seq",{"sourceInterval":[4259,4289]},["app",{"sourceInterval":[4259,4272]},"letterAsciiUC",[]],["star",{"sourceInterval":[4273,4289]},["app",{"sourceInterval":[4273,4288]},"typeLiteralPart",[]]]]],"typeLiteralPart":["define",{"sourceInterval":[4294,4337]},null,[],["alt",{"sourceInterval":[4312,4337]},["app",{"sourceInterval":[4312,4323]},"letterAscii",[]],["app",{"sourceInterval":[4326,4331]},"digit",[]],["terminal",{"sourceInterval":[4334,4337]},"_"]]],"integerLiteral":["define",{"sourceInterval":[4544,4598]},null,[],["alt",{"sourceInterval":[4561,4598]},["app",{"sourceInterval":[4561,4578]},"integerLiteralHex",[]],["app",{"sourceInterval":[4581,4598]},"integerLiteralDec",[]]]],"integerLiteralDec":["define",{"sourceInterval":[4625,4651]},null,[],["plus",{"sourceInterval":[4645,4651]},["app",{"sourceInterval":[4645,4650]},"digit",[]]]],"integerLiteralHex":["define",{"sourceInterval":[4656,4729]},null,[],["alt",{"sourceInterval":[4676,4729]},["seq",{"sourceInterval":[4676,4690]},["terminal",{"sourceInterval":[4676,4680]},"0x"],["plus",{"sourceInterval":[4681,4690]},["app",{"sourceInterval":[4681,4689]},"hexDigit",[]]]],["seq",{"sourceInterval":[4715,4729]},["terminal",{"sourceInterval":[4715,4719]},"0X"],["plus",{"sourceInterval":[4720,4729]},["app",{"sourceInterval":[4720,4728]},"hexDigit",[]]]]]],"letterAsciiLC":["define",{"sourceInterval":[4750,4774]},null,[],["range",{"sourceInterval":[4766,4774]},"a","z"]],"letterAsciiUC":["define",{"sourceInterval":[4779,4803]},null,[],["range",{"sourceInterval":[4795,4803]},"A","Z"]],"letterAscii":["define",{"sourceInterval":[4808,4851]},null,[],["alt",{"sourceInterval":[4822,4851]},["app",{"sourceInterval":[4822,4835]},"letterAsciiLC",[]],["app",{"sourceInterval":[4838,4851]},"letterAsciiUC",[]]]],"idStart":["define",{"sourceInterval":[4875,4902]},null,[],["alt",{"sourceInterval":[4885,4902]},["app",{"sourceInterval":[4885,4896]},"letterAscii",[]],["terminal",{"sourceInterval":[4899,4902]},"_"]]],"idPart":["define",{"sourceInterval":[4907,4941]},null,[],["alt",{"sourceInterval":[4916,4941]},["app",{"sourceInterval":[4916,4927]},"letterAscii",[]],["app",{"sourceInterval":[4930,4935]},"digit",[]],["terminal",{"sourceInterval":[4938,4941]},"_"]]],"id":["define",{"sourceInterval":[4946,4980]},null,[],["seq",{"sourceInterval":[4951,4980]},["not",{"sourceInterval":[4951,4964]},["app",{"sourceInterval":[4952,4964]},"reservedWord",[]]],["app",{"sourceInterval":[4965,4972]},"idStart",[]],["star",{"sourceInterval":[4973,4980]},["app",{"sourceInterval":[4973,4979]},"idPart",[]]]]],"boolLiteral":["define",{"sourceInterval":[5006,5046]},null,[],["seq",{"sourceInterval":[5020,5046]},["alt",{"sourceInterval":[5021,5037]},["terminal",{"sourceInterval":[5021,5027]},"true"],["terminal",{"sourceInterval":[5030,5037]},"false"]],["not",{"sourceInterval":[5039,5046]},["app",{"sourceInterval":[5040,5046]},"idPart",[]]]]],"keyword":["define",{"sourceInterval":[5068,5187]},null,[],["alt",{"sourceInterval":[5078,5187]},["app",{"sourceInterval":[5078,5084]},"struct",[]],["app",{"sourceInterval":[5087,5095]},"contract",[]],["app",{"sourceInterval":[5098,5101]},"fun",[]],["app",{"sourceInterval":[5104,5107]},"let",[]],["app",{"sourceInterval":[5110,5116]},"return",[]],["app",{"sourceInterval":[5119,5128]},"primitive",[]],["app",{"sourceInterval":[5131,5137]},"extend",[]],["app",{"sourceInterval":[5140,5146]},"native",[]],["app",{"sourceInterval":[5149,5155]},"public",[]],["app",{"sourceInterval":[5158,5161]},"get",[]],["app",{"sourceInterval":[5164,5168]},"null",[]],["app",{"sourceInterval":[5171,5173]},"if",[]],["app",{"sourceInterval":[5176,5180]},"else",[]],["app",{"sourceInterval":[5183,5187]},"init",[]]]],"struct":["define",{"sourceInterval":[5214,5239]},null,[],["seq",{"sourceInterval":[5223,5239]},["terminal",{"sourceInterval":[5223,5231]},"struct"],["not",{"sourceInterval":[5232,5239]},["app",{"sourceInterval":[5233,5239]},"idPart",[]]]]],"contract":["define",{"sourceInterval":[5244,5273]},null,[],["seq",{"sourceInterval":[5255,5273]},["terminal",{"sourceInterval":[5255,5265]},"contract"],["not",{"sourceInterval":[5266,5273]},["app",{"sourceInterval":[5267,5273]},"idPart",[]]]]],"let":["define",{"sourceInterval":[5278,5297]},null,[],["seq",{"sourceInterval":[5284,5297]},["terminal",{"sourceInterval":[5284,5289]},"let"],["not",{"sourceInterval":[5290,5297]},["app",{"sourceInterval":[5291,5297]},"idPart",[]]]]],"fun":["define",{"sourceInterval":[5302,5321]},null,[],["seq",{"sourceInterval":[5308,5321]},["terminal",{"sourceInterval":[5308,5313]},"fun"],["not",{"sourceInterval":[5314,5321]},["app",{"sourceInterval":[5315,5321]},"idPart",[]]]]],"return":["define",{"sourceInterval":[5326,5351]},null,[],["seq",{"sourceInterval":[5335,5351]},["terminal",{"sourceInterval":[5335,5343]},"return"],["not",{"sourceInterval":[5344,5351]},["app",{"sourceInterval":[5345,5351]},"idPart",[]]]]],"primitive":["define",{"sourceInterval":[5356,5387]},null,[],["seq",{"sourceInterval":[5368,5387]},["terminal",{"sourceInterval":[5368,5379]},"primitive"],["not",{"sourceInterval":[5380,5387]},["app",{"sourceInterval":[5381,5387]},"idPart",[]]]]],"extend":["define",{"sourceInterval":[5392,5417]},null,[],["seq",{"sourceInterval":[5401,5417]},["terminal",{"sourceInterval":[5401,5409]},"extend"],["not",{"sourceInterval":[5410,5417]},["app",{"sourceInterval":[5411,5417]},"idPart",[]]]]],"native":["define",{"sourceInterval":[5422,5447]},null,[],["seq",{"sourceInterval":[5431,5447]},["terminal",{"sourceInterval":[5431,5439]},"native"],["not",{"sourceInterval":[5440,5447]},["app",{"sourceInterval":[5441,5447]},"idPart",[]]]]],"public":["define",{"sourceInterval":[5452,5477]},null,[],["seq",{"sourceInterval":[5461,5477]},["terminal",{"sourceInterval":[5461,5469]},"public"],["not",{"sourceInterval":[5470,5477]},["app",{"sourceInterval":[5471,5477]},"idPart",[]]]]],"null":["define",{"sourceInterval":[5482,5503]},null,[],["seq",{"sourceInterval":[5489,5503]},["terminal",{"sourceInterval":[5489,5495]},"null"],["not",{"sourceInterval":[5496,5503]},["app",{"sourceInterval":[5497,5503]},"idPart",[]]]]],"get":["define",{"sourceInterval":[5508,5527]},null,[],["seq",{"sourceInterval":[5514,5527]},["terminal",{"sourceInterval":[5514,5519]},"get"],["not",{"sourceInterval":[5520,5527]},["app",{"sourceInterval":[5521,5527]},"idPart",[]]]]],"if":["define",{"sourceInterval":[5532,5549]},null,[],["seq",{"sourceInterval":[5537,5549]},["terminal",{"sourceInterval":[5537,5541]},"if"],["not",{"sourceInterval":[5542,5549]},["app",{"sourceInterval":[5543,5549]},"idPart",[]]]]],"else":["define",{"sourceInterval":[5554,5575]},null,[],["seq",{"sourceInterval":[5561,5575]},["terminal",{"sourceInterval":[5561,5567]},"else"],["not",{"sourceInterval":[5568,5575]},["app",{"sourceInterval":[5569,5575]},"idPart",[]]]]],"init":["define",{"sourceInterval":[5580,5601]},null,[],["seq",{"sourceInterval":[5587,5601]},["terminal",{"sourceInterval":[5587,5593]},"init"],["not",{"sourceInterval":[5594,5601]},["app",{"sourceInterval":[5595,5601]},"idPart",[]]]]],"nameAttribute":["define",{"sourceInterval":[5625,5648]},null,[],["terminal",{"sourceInterval":[5641,5648]},"@name"]],"reservedWord":["define",{"sourceInterval":[5670,5692]},null,[],["app",{"sourceInterval":[5685,5692]},"keyword",[]]]}]);module.exports=result;