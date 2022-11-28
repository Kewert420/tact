'use strict';const ohm=require('ohm-js');const result=ohm.makeRecipe(["grammar",{"source":"Tact {\n\n    // Starting point of the program\n    Program = ProgramItem*\n    ProgramItem = Struct\n                | Contract\n                | Primitive\n\n    // Built-in declarations\n    Primitive = primitive Type \";\"\n\n    // Field declarations\n    Type = typeLiteral\n    Field = var id \":\" Type \";\"\n\n    // Struct\n    Struct = struct id \"{\" StructBody* \"}\"\n    StructBody = Field\n\n    // Contract\n    Contract = contract id \"{\" ContractBody* \"}\"\n    ContractBody = Field\n                 | Function \n\n    // Function\n    Function = fun id \"(\" ListOf<FunctionArg,\",\"> \")\" \":\" Type \"{\" Statement* \"}\"\n    FunctionArg = id \":\" Type\n\n    // Statements\n    Statement = StatementLet\n              | StatementBlock\n              | StatementReturn\n    StatementBlock = \"{\" Statement* \"}\"\n    StatementLet = let id \":\" Type \"=\" Expression \";\"\n    StatementReturn = return Expression \";\"\n\n    // Expressions\n    Expression = ExpressionAdd\n    ExpressionMul = ExpressionMul \"*\" ExpressionUnary --mul\n                  | ExpressionMul \"/\" ExpressionUnary --div\n                  | ExpressionUnary\n    ExpressionAdd = ExpressionAdd \"+\" ExpressionMul --add\n                  | ExpressionAdd \"-\" ExpressionMul --sub\n                  | ExpressionMul\n    ExpressionUnary = \"-\" ExpressionUnary --neg\n                    | \"+\" ExpressionUnary --add\n                    | \"!\" ExpressionUnary --log_not\n                    | \"~\" ExpressionUnary --bit_not\n                    | ExpressionValue\n    // Order is important\n    ExpressionValue = ExpressionCall\n                    | ExpressionField\n                    | integerLiteral\n                    // | nullLiteral\n                    | boolLiteral\n                    | id\n                    \n    ExpressionField = ExpressionValue \".\" id\n    ExpressionCall = ExpressionValue \".\" id \"(\" ListOf<Expression, \",\"> \")\"\n\n    // Type Literal\n    typeLiteral = letterAsciiUC typeLiteralPart*\n    typeLiteralPart = letterAscii | digit | \"_\"\n\n    // Integer Literal\n    // hexDigit defined in Ohm's built-in rules (otherwise: hexDigit = \"0\"..\"9\" | \"a\"..\"f\" | \"A\"..\"F\")\n    // digit defined in Ohm's built-in rules (otherwise: digit = \"0\"..\"9\")\n    integerLiteral = integerLiteralHex | integerLiteralDec // Order is important\n    integerLiteralDec = digit+\n    integerLiteralHex = \"0x\" hexDigit+\n                      | \"0X\" hexDigit+\n\n    // Letters\n    letterAsciiLC = \"a\"..\"z\"\n    letterAsciiUC = \"A\"..\"Z\"\n    letterAscii = letterAsciiLC | letterAsciiUC\n\n    // ID Literal\n    idStart = letterAscii\n    idPart = letterAscii | digit | \"_\"\n    id = ~reservedWord idStart idPart*\n\n    // Bool Literal\n    // nullLiteral = \"null\" ~idPart\n    boolLiteral = (\"true\" | \"false\") ~idPart\n\n    // Keywords\n    keyword = struct | contract | var | fun | let | return // Order is important\n    struct = \"struct\" ~idPart\n    contract = \"contract\" ~idPart\n    var = \"var\" ~idPart\n    let = \"let\" ~idPart\n    fun = \"fun\" ~idPart\n    return = \"return\" ~idPart\n    primitive = \"primitive\" ~idPart\n\n    // Reserved\n    reservedWord = keyword\n}"},"Tact",null,"Program",{"Program":["define",{"sourceInterval":[49,71]},null,[],["star",{"sourceInterval":[59,71]},["app",{"sourceInterval":[59,70]},"ProgramItem",[]]]],"ProgramItem":["define",{"sourceInterval":[76,151]},null,[],["alt",{"sourceInterval":[90,151]},["app",{"sourceInterval":[90,96]},"Struct",[]],["app",{"sourceInterval":[115,123]},"Contract",[]],["app",{"sourceInterval":[142,151]},"Primitive",[]]]],"Primitive":["define",{"sourceInterval":[186,216]},null,[],["seq",{"sourceInterval":[198,216]},["app",{"sourceInterval":[198,207]},"primitive",[]],["app",{"sourceInterval":[208,212]},"Type",[]],["terminal",{"sourceInterval":[213,216]},";"]]],"Type":["define",{"sourceInterval":[248,266]},null,[],["app",{"sourceInterval":[255,266]},"typeLiteral",[]]],"Field":["define",{"sourceInterval":[271,298]},null,[],["seq",{"sourceInterval":[279,298]},["app",{"sourceInterval":[279,282]},"var",[]],["app",{"sourceInterval":[283,285]},"id",[]],["terminal",{"sourceInterval":[286,289]},":"],["app",{"sourceInterval":[290,294]},"Type",[]],["terminal",{"sourceInterval":[295,298]},";"]]],"Struct":["define",{"sourceInterval":[318,356]},null,[],["seq",{"sourceInterval":[327,356]},["app",{"sourceInterval":[327,333]},"struct",[]],["app",{"sourceInterval":[334,336]},"id",[]],["terminal",{"sourceInterval":[337,340]},"{"],["star",{"sourceInterval":[341,352]},["app",{"sourceInterval":[341,351]},"StructBody",[]]],["terminal",{"sourceInterval":[353,356]},"}"]]],"StructBody":["define",{"sourceInterval":[361,379]},null,[],["app",{"sourceInterval":[374,379]},"Field",[]]],"Contract":["define",{"sourceInterval":[401,445]},null,[],["seq",{"sourceInterval":[412,445]},["app",{"sourceInterval":[412,420]},"contract",[]],["app",{"sourceInterval":[421,423]},"id",[]],["terminal",{"sourceInterval":[424,427]},"{"],["star",{"sourceInterval":[428,441]},["app",{"sourceInterval":[428,440]},"ContractBody",[]]],["terminal",{"sourceInterval":[442,445]},"}"]]],"ContractBody":["define",{"sourceInterval":[450,498]},null,[],["alt",{"sourceInterval":[465,498]},["app",{"sourceInterval":[465,470]},"Field",[]],["app",{"sourceInterval":[490,498]},"Function",[]]]],"Function":["define",{"sourceInterval":[521,598]},null,[],["seq",{"sourceInterval":[532,598]},["app",{"sourceInterval":[532,535]},"fun",[]],["app",{"sourceInterval":[536,538]},"id",[]],["terminal",{"sourceInterval":[539,542]},"("],["app",{"sourceInterval":[543,566]},"ListOf",[["app",{"sourceInterval":[550,561]},"FunctionArg",[]],["terminal",{"sourceInterval":[562,565]},","]]],["terminal",{"sourceInterval":[567,570]},")"],["terminal",{"sourceInterval":[571,574]},":"],["app",{"sourceInterval":[575,579]},"Type",[]],["terminal",{"sourceInterval":[580,583]},"{"],["star",{"sourceInterval":[584,594]},["app",{"sourceInterval":[584,593]},"Statement",[]]],["terminal",{"sourceInterval":[595,598]},"}"]]],"FunctionArg":["define",{"sourceInterval":[603,628]},null,[],["seq",{"sourceInterval":[617,628]},["app",{"sourceInterval":[617,619]},"id",[]],["terminal",{"sourceInterval":[620,623]},":"],["app",{"sourceInterval":[624,628]},"Type",[]]]],"Statement":["define",{"sourceInterval":[652,739]},null,[],["alt",{"sourceInterval":[664,739]},["app",{"sourceInterval":[664,676]},"StatementLet",[]],["app",{"sourceInterval":[693,707]},"StatementBlock",[]],["app",{"sourceInterval":[724,739]},"StatementReturn",[]]]],"StatementBlock":["define",{"sourceInterval":[744,779]},null,[],["seq",{"sourceInterval":[761,779]},["terminal",{"sourceInterval":[761,764]},"{"],["star",{"sourceInterval":[765,775]},["app",{"sourceInterval":[765,774]},"Statement",[]]],["terminal",{"sourceInterval":[776,779]},"}"]]],"StatementLet":["define",{"sourceInterval":[784,833]},null,[],["seq",{"sourceInterval":[799,833]},["app",{"sourceInterval":[799,802]},"let",[]],["app",{"sourceInterval":[803,805]},"id",[]],["terminal",{"sourceInterval":[806,809]},":"],["app",{"sourceInterval":[810,814]},"Type",[]],["terminal",{"sourceInterval":[815,818]},"="],["app",{"sourceInterval":[819,829]},"Expression",[]],["terminal",{"sourceInterval":[830,833]},";"]]],"StatementReturn":["define",{"sourceInterval":[838,877]},null,[],["seq",{"sourceInterval":[856,877]},["app",{"sourceInterval":[856,862]},"return",[]],["app",{"sourceInterval":[863,873]},"Expression",[]],["terminal",{"sourceInterval":[874,877]},";"]]],"Expression":["define",{"sourceInterval":[902,928]},null,[],["app",{"sourceInterval":[915,928]},"ExpressionAdd",[]]],"ExpressionMul_mul":["define",{"sourceInterval":[949,988]},null,[],["seq",{"sourceInterval":[949,982]},["app",{"sourceInterval":[949,962]},"ExpressionMul",[]],["terminal",{"sourceInterval":[963,966]},"*"],["app",{"sourceInterval":[967,982]},"ExpressionUnary",[]]]],"ExpressionMul_div":["define",{"sourceInterval":[1009,1048]},null,[],["seq",{"sourceInterval":[1009,1042]},["app",{"sourceInterval":[1009,1022]},"ExpressionMul",[]],["terminal",{"sourceInterval":[1023,1026]},"/"],["app",{"sourceInterval":[1027,1042]},"ExpressionUnary",[]]]],"ExpressionMul":["define",{"sourceInterval":[933,1084]},null,[],["alt",{"sourceInterval":[949,1084]},["app",{"sourceInterval":[949,982]},"ExpressionMul_mul",[]],["app",{"sourceInterval":[1009,1042]},"ExpressionMul_div",[]],["app",{"sourceInterval":[1069,1084]},"ExpressionUnary",[]]]],"ExpressionAdd_add":["define",{"sourceInterval":[1105,1142]},null,[],["seq",{"sourceInterval":[1105,1136]},["app",{"sourceInterval":[1105,1118]},"ExpressionAdd",[]],["terminal",{"sourceInterval":[1119,1122]},"+"],["app",{"sourceInterval":[1123,1136]},"ExpressionMul",[]]]],"ExpressionAdd_sub":["define",{"sourceInterval":[1163,1200]},null,[],["seq",{"sourceInterval":[1163,1194]},["app",{"sourceInterval":[1163,1176]},"ExpressionAdd",[]],["terminal",{"sourceInterval":[1177,1180]},"-"],["app",{"sourceInterval":[1181,1194]},"ExpressionMul",[]]]],"ExpressionAdd":["define",{"sourceInterval":[1089,1234]},null,[],["alt",{"sourceInterval":[1105,1234]},["app",{"sourceInterval":[1105,1136]},"ExpressionAdd_add",[]],["app",{"sourceInterval":[1163,1194]},"ExpressionAdd_sub",[]],["app",{"sourceInterval":[1221,1234]},"ExpressionMul",[]]]],"ExpressionUnary_neg":["define",{"sourceInterval":[1257,1282]},null,[],["seq",{"sourceInterval":[1257,1276]},["terminal",{"sourceInterval":[1257,1260]},"-"],["app",{"sourceInterval":[1261,1276]},"ExpressionUnary",[]]]],"ExpressionUnary_add":["define",{"sourceInterval":[1305,1330]},null,[],["seq",{"sourceInterval":[1305,1324]},["terminal",{"sourceInterval":[1305,1308]},"+"],["app",{"sourceInterval":[1309,1324]},"ExpressionUnary",[]]]],"ExpressionUnary_log_not":["define",{"sourceInterval":[1353,1382]},null,[],["seq",{"sourceInterval":[1353,1372]},["terminal",{"sourceInterval":[1353,1356]},"!"],["app",{"sourceInterval":[1357,1372]},"ExpressionUnary",[]]]],"ExpressionUnary_bit_not":["define",{"sourceInterval":[1405,1434]},null,[],["seq",{"sourceInterval":[1405,1424]},["terminal",{"sourceInterval":[1405,1408]},"~"],["app",{"sourceInterval":[1409,1424]},"ExpressionUnary",[]]]],"ExpressionUnary":["define",{"sourceInterval":[1239,1472]},null,[],["alt",{"sourceInterval":[1257,1472]},["app",{"sourceInterval":[1257,1276]},"ExpressionUnary_neg",[]],["app",{"sourceInterval":[1305,1324]},"ExpressionUnary_add",[]],["app",{"sourceInterval":[1353,1372]},"ExpressionUnary_log_not",[]],["app",{"sourceInterval":[1405,1424]},"ExpressionUnary_bit_not",[]],["app",{"sourceInterval":[1457,1472]},"ExpressionValue",[]]]],"ExpressionValue":["define",{"sourceInterval":[1503,1706]},null,[],["alt",{"sourceInterval":[1521,1706]},["app",{"sourceInterval":[1521,1535]},"ExpressionCall",[]],["app",{"sourceInterval":[1558,1573]},"ExpressionField",[]],["app",{"sourceInterval":[1596,1610]},"integerLiteral",[]],["app",{"sourceInterval":[1670,1681]},"boolLiteral",[]],["app",{"sourceInterval":[1704,1706]},"id",[]]]],"ExpressionField":["define",{"sourceInterval":[1732,1772]},null,[],["seq",{"sourceInterval":[1750,1772]},["app",{"sourceInterval":[1750,1765]},"ExpressionValue",[]],["terminal",{"sourceInterval":[1766,1769]},"."],["app",{"sourceInterval":[1770,1772]},"id",[]]]],"ExpressionCall":["define",{"sourceInterval":[1777,1848]},null,[],["seq",{"sourceInterval":[1794,1848]},["app",{"sourceInterval":[1794,1809]},"ExpressionValue",[]],["terminal",{"sourceInterval":[1810,1813]},"."],["app",{"sourceInterval":[1814,1816]},"id",[]],["terminal",{"sourceInterval":[1817,1820]},"("],["app",{"sourceInterval":[1821,1844]},"ListOf",[["app",{"sourceInterval":[1828,1838]},"Expression",[]],["terminal",{"sourceInterval":[1840,1843]},","]]],["terminal",{"sourceInterval":[1845,1848]},")"]]],"typeLiteral":["define",{"sourceInterval":[1874,1918]},null,[],["seq",{"sourceInterval":[1888,1918]},["app",{"sourceInterval":[1888,1901]},"letterAsciiUC",[]],["star",{"sourceInterval":[1902,1918]},["app",{"sourceInterval":[1902,1917]},"typeLiteralPart",[]]]]],"typeLiteralPart":["define",{"sourceInterval":[1923,1966]},null,[],["alt",{"sourceInterval":[1941,1966]},["app",{"sourceInterval":[1941,1952]},"letterAscii",[]],["app",{"sourceInterval":[1955,1960]},"digit",[]],["terminal",{"sourceInterval":[1963,1966]},"_"]]],"integerLiteral":["define",{"sourceInterval":[2173,2227]},null,[],["alt",{"sourceInterval":[2190,2227]},["app",{"sourceInterval":[2190,2207]},"integerLiteralHex",[]],["app",{"sourceInterval":[2210,2227]},"integerLiteralDec",[]]]],"integerLiteralDec":["define",{"sourceInterval":[2254,2280]},null,[],["plus",{"sourceInterval":[2274,2280]},["app",{"sourceInterval":[2274,2279]},"digit",[]]]],"integerLiteralHex":["define",{"sourceInterval":[2285,2358]},null,[],["alt",{"sourceInterval":[2305,2358]},["seq",{"sourceInterval":[2305,2319]},["terminal",{"sourceInterval":[2305,2309]},"0x"],["plus",{"sourceInterval":[2310,2319]},["app",{"sourceInterval":[2310,2318]},"hexDigit",[]]]],["seq",{"sourceInterval":[2344,2358]},["terminal",{"sourceInterval":[2344,2348]},"0X"],["plus",{"sourceInterval":[2349,2358]},["app",{"sourceInterval":[2349,2357]},"hexDigit",[]]]]]],"letterAsciiLC":["define",{"sourceInterval":[2379,2403]},null,[],["range",{"sourceInterval":[2395,2403]},"a","z"]],"letterAsciiUC":["define",{"sourceInterval":[2408,2432]},null,[],["range",{"sourceInterval":[2424,2432]},"A","Z"]],"letterAscii":["define",{"sourceInterval":[2437,2480]},null,[],["alt",{"sourceInterval":[2451,2480]},["app",{"sourceInterval":[2451,2464]},"letterAsciiLC",[]],["app",{"sourceInterval":[2467,2480]},"letterAsciiUC",[]]]],"idStart":["define",{"sourceInterval":[2504,2525]},null,[],["app",{"sourceInterval":[2514,2525]},"letterAscii",[]]],"idPart":["define",{"sourceInterval":[2530,2564]},null,[],["alt",{"sourceInterval":[2539,2564]},["app",{"sourceInterval":[2539,2550]},"letterAscii",[]],["app",{"sourceInterval":[2553,2558]},"digit",[]],["terminal",{"sourceInterval":[2561,2564]},"_"]]],"id":["define",{"sourceInterval":[2569,2603]},null,[],["seq",{"sourceInterval":[2574,2603]},["not",{"sourceInterval":[2574,2587]},["app",{"sourceInterval":[2575,2587]},"reservedWord",[]]],["app",{"sourceInterval":[2588,2595]},"idStart",[]],["star",{"sourceInterval":[2596,2603]},["app",{"sourceInterval":[2596,2602]},"idPart",[]]]]],"boolLiteral":["define",{"sourceInterval":[2665,2705]},null,[],["seq",{"sourceInterval":[2679,2705]},["alt",{"sourceInterval":[2680,2696]},["terminal",{"sourceInterval":[2680,2686]},"true"],["terminal",{"sourceInterval":[2689,2696]},"false"]],["not",{"sourceInterval":[2698,2705]},["app",{"sourceInterval":[2699,2705]},"idPart",[]]]]],"keyword":["define",{"sourceInterval":[2727,2781]},null,[],["alt",{"sourceInterval":[2737,2781]},["app",{"sourceInterval":[2737,2743]},"struct",[]],["app",{"sourceInterval":[2746,2754]},"contract",[]],["app",{"sourceInterval":[2757,2760]},"var",[]],["app",{"sourceInterval":[2763,2766]},"fun",[]],["app",{"sourceInterval":[2769,2772]},"let",[]],["app",{"sourceInterval":[2775,2781]},"return",[]]]],"struct":["define",{"sourceInterval":[2808,2833]},null,[],["seq",{"sourceInterval":[2817,2833]},["terminal",{"sourceInterval":[2817,2825]},"struct"],["not",{"sourceInterval":[2826,2833]},["app",{"sourceInterval":[2827,2833]},"idPart",[]]]]],"contract":["define",{"sourceInterval":[2838,2867]},null,[],["seq",{"sourceInterval":[2849,2867]},["terminal",{"sourceInterval":[2849,2859]},"contract"],["not",{"sourceInterval":[2860,2867]},["app",{"sourceInterval":[2861,2867]},"idPart",[]]]]],"var":["define",{"sourceInterval":[2872,2891]},null,[],["seq",{"sourceInterval":[2878,2891]},["terminal",{"sourceInterval":[2878,2883]},"var"],["not",{"sourceInterval":[2884,2891]},["app",{"sourceInterval":[2885,2891]},"idPart",[]]]]],"let":["define",{"sourceInterval":[2896,2915]},null,[],["seq",{"sourceInterval":[2902,2915]},["terminal",{"sourceInterval":[2902,2907]},"let"],["not",{"sourceInterval":[2908,2915]},["app",{"sourceInterval":[2909,2915]},"idPart",[]]]]],"fun":["define",{"sourceInterval":[2920,2939]},null,[],["seq",{"sourceInterval":[2926,2939]},["terminal",{"sourceInterval":[2926,2931]},"fun"],["not",{"sourceInterval":[2932,2939]},["app",{"sourceInterval":[2933,2939]},"idPart",[]]]]],"return":["define",{"sourceInterval":[2944,2969]},null,[],["seq",{"sourceInterval":[2953,2969]},["terminal",{"sourceInterval":[2953,2961]},"return"],["not",{"sourceInterval":[2962,2969]},["app",{"sourceInterval":[2963,2969]},"idPart",[]]]]],"primitive":["define",{"sourceInterval":[2974,3005]},null,[],["seq",{"sourceInterval":[2986,3005]},["terminal",{"sourceInterval":[2986,2997]},"primitive"],["not",{"sourceInterval":[2998,3005]},["app",{"sourceInterval":[2999,3005]},"idPart",[]]]]],"reservedWord":["define",{"sourceInterval":[3027,3049]},null,[],["app",{"sourceInterval":[3042,3049]},"keyword",[]]]}]);module.exports=result;