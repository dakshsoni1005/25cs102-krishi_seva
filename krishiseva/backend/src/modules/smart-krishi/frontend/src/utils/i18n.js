const translations = {
  en: {
    navHome: "Home",
    navRecommendation: "Recommendation",
    navWeather: "Weather",
    navMarket: "Market Prices",
    navAbout: "About",
    navContact: "Contact",
    heroTagline: "AI-Powered Agriculture Engine",
    heroHeadline: "Cultivating the Future of Smart Farming",
    heroSubtitle: "Elevate your yields with instant soil matching, localized Open-Meteo weather forecasting, APMC market trackers, and customized Google Gemini AI recommendations.",
    heroCTAStart: "Launch Advisor",
    heroCTAWeather: "View Weather",
    heroStatDistricts: "Districts Supported",
    heroStatData: "Data Consistency",
    heroStatReport: "AI Advisory Report",
    formTitle: "Agricultural Parameter Query",
    formSubtitle: "Select your local district coordinates, desired crop, and growing season to generate advisories.",
    formStep1: "Select District",
    formStep2: "Choose Crop",
    formStep3: "Select Season",
    formSubmit: "Generate Plan",
    weatherTitle: "Current Weather",
    weatherSensible: "Sensible Temp",
    weatherHumidity: "Humidity",
    weatherWind: "Wind Speed",
    weatherRain: "Rain Probability",
    weatherCondition: "Condition",
    soilTitle: "Soil Properties & Health",
    soilType: "Soil Type",
    soilTexture: "Texture Class",
    soilPH: "Soil pH",
    soilNPK: "NPK Nutrients Status",
    fertilizerTitle: "Fertilizer Schedule Roadmap",
    irrigationTitle: "Irrigation Schedule",
    irrigationFreq: "Watering Frequency",
    irrigationDepth: "Target Water Depth",
    diseaseTitle: "Potential Diseases",
    diseaseSymptoms: "Symptoms",
    diseaseCure: "Remedy & Cure",
    pestTitle: "Active Pest Threats",
    pestControl: "Control & Action",
    advisoryTitle: "Advisories & Alerts",
    emptyState: "No query results loaded. Submit the parameter filter panel above to query agricultural conditions.",
    weatherHeaderTitle: "Regional Weather Stations",
    weatherHeaderSubtitle: "Select any district below to fetch real-time temperature, wind speeds, rain, and WMO forecast tracks.",
    weatherSelectLabel: "District",
    weatherLoading: "Fetching live weather metrics...",
    weatherEmpty: "No district selected. Choose a district above to load local weather details.",
    marketTitle: "APMC Market Prices",
    marketSubtitle: "Monitor real-time crop wholesale prices and transaction volumes across agricultural market yards in Gujarat.",
    marketLoading: "Fetching market wholesale rates...",
    marketEmpty: "No crop selected. Choose a crop above to query current wholesale market pricing yards.",

    // Support Labels
    contactHeadline: "Agricultural Helplines & Support",
    contactSubtitle: "Connect with agricultural experts, universities, and government support systems.",
    contactTollFree: "Toll-Free Kisan Support Numbers",
    contactFeedbackTitle: "Submit Technical Feedback",
    contactFeedbackDesc: "For system suggestions, API bugs, or developer inquiries, email us at:",
    "Kisan Call Centre (KCC)": "Kisan Call Centre (KCC)",
    "Toll-free agricultural query helpline operated by the Ministry of Agriculture.": "Toll-free agricultural query helpline operated by the Ministry of Agriculture.",
    "Gujarat Krishi Mahotsav Helpline": "Gujarat Krishi Mahotsav Helpline",
    "State-sponsored advisory helpline for localized crop information.": "State-sponsored advisory helpline for localized crop information.",

    // About Labels
    aboutHeadline: "About Smart Krishi",
    aboutSubtitle: "Empowering agricultural decision support systems with direct weather feeds, structured database indices, and Gemini AI.",
    aboutBody: "Smart Krishi is a data-driven agricultural decision support platform. We combine localized soil profiles, crop calendars, and live weather conditions to generate action-oriented guidance for farmers.",
    aboutArchTitle: "System Architecture",
    aboutSec1Title: "Normalized Database Layer",
    aboutSec1Desc: "Leverages 13 distinct MongoDB collections detailing soil, target fertilizers, watering schemas, and historical crop timelines to construct a comprehensive agricultural context.",
    aboutSec2Title: "Open-Meteo Integration",
    aboutSec2Desc: "Queries localized lat/lng coordinates resolved dynamically from MongoDB to gather current weather conditions and 7-day daily forecasts without requiring complex API credentials.",
    aboutSec3Title: "Google Gemini AI Engine",
    aboutSec3Desc: "Feeds environmental data, crop profiles, and weather warning states to the `gemini-1.5-flash` model to compose structured summaries, Dos, and Don'ts checklists for farmers."
  },
  hi: {
    navHome: "मुख्य पृष्ठ",
    navRecommendation: "सलाह",
    navWeather: "मौसम",
    navMarket: "बाजार मूल्य",
    navAbout: "हमारे बारे में",
    navContact: "संपर्क",
    heroTagline: "एआई-संचालित कृषि इंजन",
    heroHeadline: "स्मार्ट खेती के भविष्य का निर्माण",
    heroSubtitle: "त्वरित मिट्टी मिलान, स्थानीय मौसम पूर्वानुमान, बाजार मूल्य और अनुकूलित जेमिनी एआई सलाह के साथ अपनी उपज बढ़ाएं।",
    heroCTAStart: "सलाहकार शुरू करें",
    heroCTAWeather: "मौसम देखें",
    heroStatDistricts: "समर्थित जिले",
    heroStatData: "डेटा निरंतरता",
    heroStatReport: "एआई सलाह रिपोर्ट",
    formTitle: "कृषि पैरामीटर क्वेरी",
    formSubtitle: "सलाह प्राप्त करने के लिए अपना जिला, फसल और मौसम चुनें।",
    formStep1: "जिला चुनें",
    formStep2: "फसल चुनें",
    formStep3: "मौसम चुनें",
    formSubmit: "योजना बनाएं",
    weatherTitle: "वर्तमान मौसम",
    weatherSensible: "तापमान महसूस",
    weatherHumidity: "आर्द्रता",
    weatherWind: "हवा की गति",
    weatherRain: "बारिश की संभावना",
    weatherCondition: "मौसम की स्थिति",
    soilTitle: "मिट्टी के गुण और स्वास्थ्य",
    soilType: "मिट्टी का प्रकार",
    soilTexture: "बनावट वर्ग",
    soilPH: "मिट्टी पीएच",
    soilNPK: "एनपीके पोषक तत्व स्थिति",
    fertilizerTitle: "उर्वरक अनुसूची रोडमैप",
    irrigationTitle: "सिंचाई समय-सारणी",
    irrigationFreq: "पानी देने की आवृत्ति",
    irrigationDepth: "लक्षित पानी की गहराई",
    diseaseTitle: "संभावित रोग",
    diseaseSymptoms: "लक्षण",
    diseaseCure: "उपचार और उपाय",
    pestTitle: "सक्रिय कीट खतरे",
    pestControl: "नियंत्रण और कार्रवाई",
    advisoryTitle: "परामर्श और अलर्ट",
    emptyState: "कोई क्वेरी परिणाम लोड नहीं हुआ। कृषि स्थितियों की पूछताछ के लिए ऊपर दिए गए फ़िल्टर पैनल को सबमिट करें।",
    weatherHeaderTitle: "क्षेत्रीय मौसम केंद्र",
    weatherHeaderSubtitle: "वास्तविक समय के तापमान, हवा की गति, बारिश और पूर्वानुमान प्राप्त करने के लिए नीचे किसी भी जिले का चयन करें।",
    weatherSelectLabel: "जिला",
    weatherLoading: "लाइव मौसम की जानकारी प्राप्त की जा रही है...",
    weatherEmpty: "कोई जिला नहीं चुना गया। स्थानीय मौसम विवरण लोड करने के लिए ऊपर एक जिला चुनें।",
    marketTitle: "APMC बाजार मूल्य",
    marketSubtitle: "गुजरात के कृषि बाजार यार्डों में वास्तविक समय की फसलों की थोक कीमतों और लेनदेन की मात्रा की निगरानी करें।",
    marketLoading: "बाजार की थोक दरें प्राप्त की जा रही हैं...",
    marketEmpty: "कोई फसल नहीं चुनी गई। वर्तमान थोक बाजार मूल्य यार्डों की पूछताछ के लिए ऊपर एक फसल चुनें।",

    // Districts Translation
    "Ahmedabad": "अहमदाबाद",
    "Amreli": "अमरेली",
    "Anand": "आणंद",
    "Aravalli": "अरावली",
    "Banaskantha": "बनासकांठा",
    "Bharuch": "भरूच",
    "Bhavnagar": "भावनगर",
    "Botad": "बोटाद",
    "Chhota Udaipur": "छोटा उदयपुर",
    "Dahod": "दाहोद",
    "Dang": "डांग",
    "Devbhoomi Dwarka": "देवभूमि द्वारका",
    "Gandhinagar": "गांधीनगर",
    "Gir Somnath": "गीर सोमनाथ",
    "Jamnagar": "जामनगर",
    "Junagadh": "जूनागढ़",
    "Kheda": "खेड़ा",
    "Kutch": "कच्छ",
    "Mahisagar": "महीसागर",
    "Mehsana": "मेहसाणा",
    "Morbi": "मोरबी",
    "Narmada": "नर्मदा",
    "Navsari": "नवसारी",
    "Panchmahal": "पंचमहल",
    "Patan": "पाटन",
    "Porbandar": "पोरबंदर",
    "Rajkot": "राजकोट",
    "Sabarkantha": "साबरकांठा",
    "Surat": "सूरत",
    "Surendranagar": "सुरेंद्रनगर",
    "Tapi": "तापी",
    "Vadodara": "वडोदरा",
    "Valsad": "वलसाड",

    // Crops Translation
    "Cotton": "कपास",
    "Groundnut": "मूंगफली",
    "Sesame": "तिल",
    "Castor": "अरंडी",
    "Wheat": "गेहूं",
    "Bajra": "बाजरा",
    "Cumin": "जीरा",
    "Mustard": "सरसों",
    "Gram": "चना",
    "Tobacco": "तंबाकू",
    "Paddy": "धान",
    "Rice": "चावल",
    "Maize": "मक्का",
    "Banana": "केला",
    "Sugarcane": "गन्ना",
    "Turmeric": "हल्दी",
    "Pigeon Pea": "अरहर",
    "Mango": "आम",
    "Sapota": "चीकू",
    "Ginger": "अदरक",
    "Finger Millet": "रागी",
    "Isabgol": "इसबगोल",
    "Date Palm": "खजूर",
    "Soybean": "सोयाबीन",
    "Tur": "अरहर (तुअर)",
    "Vegetables": "सब्जियां",
    "Potato": "आलू",

    // Market Page Dynamic Crops
    "Chikoo (Sapota)": "चीकू",
    "Chilli": "मिर्च",
    "Cumin (Jeera)": "जीरा",
    "Fennel (Variyali)": "सौंफ",
    "Gram (Chana)": "चना",
    "Guar (Cluster Bean)": "ग्वार",
    "Onion": "प्याज",
    "Castor (Divela)": "अरंडी",
    "Cotton (Kapas)": "कपास",
    "Groundnut (Magfali)": "मूंगफली",
    "Mustard (Rai)": "सरसों",
    "Paddy (Dangar)": "धान",
    "Sesame (Til)": "तिल",
    "Wheat (Ghau)": "गेहूं",
    "Maize (Makai)": "मक्का",
    "Potato (Bataka)": "आलू",

    // Support Translation
    contactHeadline: "कृषि हेल्पलाइन और सहायता",
    contactSubtitle: "कृषि विशेषज्ञों, विश्वविद्यालयों और सरकारी सहायता प्रणालियों से जुड़ें।",
    contactTollFree: "टोल-फ्री किसान सहायता नंबर",
    contactFeedbackTitle: "तकनीकी प्रतिक्रिया सबमिट करें",
    contactFeedbackDesc: "प्रणाली सुझावों, एपीआई बग या डेवलपर पूछताछ के लिए, हमें ईमेल करें:",
    "Kisan Call Centre (KCC)": "किसान कॉल सेंटर (KCC)",
    "Toll-free agricultural query helpline operated by the Ministry of Agriculture.": "कृषि मंत्रालय द्वारा संचालित टोल-फ्री कृषि प्रश्न हेल्पलाइन।",
    "Gujarat Krishi Mahotsav Helpline": "गुजरात कृषि महोत्सव हेल्पलाइन",
    "State-sponsored advisory helpline for localized crop information.": "स्थानीयकृत फसल जानकारी के लिए राज्य प्रायोजित सलाहकार हेल्पलाइन।",

    // About Translation
    aboutHeadline: "स्मार्ट कृषि के बारे में",
    aboutSubtitle: "प्रत्यक्ष मौसम फ़ीड, संरचित डेटाबेस सूचकांकों और जेमिनी एआई के साथ कृषि निर्णय सहायता प्रणालियों को सशक्त बनाना।",
    aboutBody: "स्मार्ट कृषि एक डेटा-संचालित कृषि निर्णय सहायता मंच है। हम किसानों के लिए कार्रवाई-उन्मुख मार्गदर्शन उत्पन्न करने के लिए स्थानीय मिट्टी के प्रोफाइल, फसल कैलेंडर और लाइव मौसम की स्थिति को जोड़ते हैं।",
    aboutArchTitle: "सिस्टम वास्तुकला",
    aboutSec1Title: "सामान्यीकृत डेटाबेस परत",
    aboutSec1Desc: "व्यापक कृषि संदर्भ का निर्माण करने के लिए मिट्टी, लक्षित उर्वरकों, पानी की योजनाओं और ऐतिहासिक फसल समय-सीमा का विवरण देने वाले 13 विशिष्ट MongoDB संग्रहों का लाभ उठाता है।",
    aboutSec2Title: "ओपन-मेटियो एकीकरण",
    aboutSec2Desc: "जटिल एपीआई क्रेडेंशियल्स की आवश्यकता के बिना वर्तमान मौसम की स्थिति और 7-दिवसीय दैनिक पूर्वानुमान एकत्र करने के लिए MongoDB से गतिशील रूप से हल किए गए स्थानीयकृत अक्षांश / देशांतर निर्देशांकों को क्वेरी करता है।",
    aboutSec3Title: "गूगल जेमिनी एआई इंजन",
    aboutSec3Desc: "किसानों के लिए संरचित सारांश, क्या करें और क्या न करें की जाँच सूची तैयार करने के लिए `gemini-1.5-flash` मॉडल को पर्यावरणीय डेटा, फसल प्रोफाइल और मौसम की चेतावनी की स्थिति फीड करता है।",

    // Soil & Details translation
    "Medium Black / Alluvial": "मध्यम काली / जलोढ़",
    "Medium Black": "मध्यम काली",
    "Alluvial": "जलोढ़",
    "Sandy loam": "बलुई दोमट",
    "Sandy": "बलुई (रेतीली)",
    "Clayey": "मटियार (चिकनी)",
    "Loamy": "दोमट",
    "Black cotton soil": "काली कपास मिट्टी",
    "Sandy Clay Loam": "बलुई चिकनी दोमट",
    "Sandy Clay": "बलुई चिकनी",
    "Clay Loam": "चिकनी दोमट",
    "Clay": "चिकनी मिट्टी",
    "Loam": "दोमट",
    "High": "उच्च",
    "Medium": "मध्यम",
    "Moderate": "मध्यम",
    "Low": "निम्न",
    "Critical": "गंभीर",
    "Optimal": "इष्टतम",

    // Weather
    "OVERCAST": "घना बादल",
    "Overcast": "घना बादल",
    "Partly Cloudy": "आंशिक रूप से बादल",
    "Clear": "साफ धूप",
    "Sunny": "साफ धूप",
    "Rainy": "बारिश",
    "Cloudy": "बादल",

    // Weekdays & units
    "Today": "आज",
    "Tomorrow": "कल",
    "Monday": "सोमवार",
    "Tuesday": "मंगलवार",
    "Wednesday": "बुधवार",
    "Thursday": "गुरुवार",
    "Friday": "शुक्रवार",
    "Saturday": "शनिवार",
    "Sunday": "रविवार",
    "Mon": "सोम",
    "Tue": "मंगल",
    "Wed": "बुध",
    "Thu": "गुरु",
    "Fri": "शुक्र",
    "Sat": "शनि",
    "Sun": "रवि",
    "WEATHER": "मौसम",
    "IRRIGATION": "सिंचाई",
    "DISEASE": "रोग",
    "Weather": "मौसम",
    "Irrigation": "सिंचाई",
    "Disease": "रोग",

    // Advisories
    "Every 15-20 Days": "प्रत्येक 15-20 दिन",
    "Every 10-12 Days": "प्रत्येक 10-12 दिन",
    "Every 7-8 Days": "प्रत्येक 7-8 दिन",
    "Rain probability > 70%: Skip irrigation today.": "बारिश की संभावना > 70%: आज सिंचाई न करें।",
    "Humidity > 85%: High fungal disease risk.": "आर्द्रता > 85%: उच्च कवक रोग का जोखिम।",
    "Stable conditions expected; maintain regular irrigation and nutrient schedule.": "स्थिर परिस्थितियों की उम्मीद है; नियमित सिंचाई और पोषक तत्व अनुसूची बनाए रखें।",
    "Monsoon showers expected; avoid irrigation and fertilizer application before rainfall.": "मानसून की बौछारें अपेक्षित हैं; वर्षा से पहले सिंचाई और उर्वरक न डालें।",
    "Avoid overhead watering if rain is forecast.": "यदि बारिश का पूर्वानुमान हो तो ओवरहेड सिंचाई से बचें।",
    "Do not apply fertilizers right before heavy rains.": "भारी बारिश से ठीक पहले उर्वरक न डालें।",

    // Fertilizers
    "Basal": "बुवाई के समय (आधार)",
    "Vegetative": "वानस्पतिक वृद्धि",
    "Flowering": "फूल आने पर",
    "DAP": "डीएपी (DAP)",
    "Urea": "यूरिया",
    "MOP": "एमओपी (MOP)",
    "FYM": "गोबर की खाद (FYM)",
    "SSP": "एसएसपी (SSP)",
    "100 kg/hectare": "100 किलोग्राम/हेक्टेयर",
    "50 kg/hectare": "50 किलोग्राम/हेक्टेयर",
    "40 kg/hectare": "40 किलोग्राम/हेक्टेयर",

    // Diseases
    "Late Blight": "पछेती झुलसा (Late Blight)",
    "Water-soaked lesions turning brown/black on leaves": "पत्तियों पर पानी से भीगे हुए धब्बे जो भूरे/काले रंग के हो जाते हैं",
    "Follow recommended cultural/chemical control for Late Blight; consult local Krishi Vigyan Kendra for exact fungicide/dose.": "पछेती झुलसा के लिए अनुशंसित सांस्कृतिक/रासायनिक नियंत्रण का पालन करें; सटीक कवकनाशी/खुराक के लिए स्थानीय कृषि विज्ञान केंद्र से संपर्क करें।",
    "Angular water-soaked leaf spots": "कोणीय जल-सिक्त पत्तों के धब्बे",
    "black lesions on bolls": "डोड़ों पर काले घाव",
    "Follow recommended cultural/chemical control for Bacterial Blight; consult local Krishi Vigyan Kendra for exact fungicide/dose.": "बैक्टीरियल ब्लाइट के लिए अनुशंसित सांस्कृतिक/रासायनिक नियंत्रण का पालन करें; सटीक कवकनाशी/खुराक के लिए स्थानीय कृषि विज्ञान केंद्र से संपर्क करें।",
    "Sudden wilting": "अचानक मुरझाना",
    "grey fungal growth at collar": "कॉलर पर ग्रे कवक वृद्धि",
    "Follow recommended cultural/chemical control for Grey Mildew (Root Rot); consult local Krishi Vigyan Kendra for exact fungicide/dose.": "ग्रे मिल्ड्यू (रूट रॉट) के लिए अनुशंसित सांस्कृतिक/रासायनिक नियंत्रण का पालन करें; सटीक कवकनाशी/खुराक के लिए स्थानीय कृषि विज्ञान केंद्र से संपर्क करें।",
    "Blast": "झोंका रोग (Blast)",
    "Spindle-shaped lesions on leaves, neck rot": "पत्तियों पर तकला आकार के घाव, गर्दन का सड़ना",
    "Bacterial Leaf Blight": "जीवाणु जनित पत्ती झुलसा",
    "Water-soaked streaks turning yellow/white": "पानी से लथपथ धारियाँ पीली/सफेद हो जाती हैं",

    // Pests
    "Pink Bollworm": "गुलाबी सुंडी (Pink Bollworm)",
    "Pheromone traps, timely picking, resistant hybrids": "फेरोमोन ट्रैप, समय पर तुड़ाई, प्रतिरोधी संकर किस्में",
    "Whitefly": "सफेद मक्खी (Whitefly)",
    "Yellow sticky traps, neem-based sprays": "पीले चिपचिपे जाल, नीम आधारित छिड़काव",
    "Aphid": "माहू (Aphid)",
    "Need-based spray, use certified seed": "आवश्यकता-आधारित छिड़काव, प्रमाणित बीजों का उपयोग",
    "7-Day Weather Forecast & Trends": "7-दिवसीय मौसम पूर्वानुमान और रुझान",
    "Stem Borer": "तना छेदक",
    "Pheromone traps, balanced fertilization": "फेरोमोन जाल, संतुलित निषेचन",
    "Brown Plant Hopper": "भूरा फुदका (Brown Plant Hopper)",
    "Avoid excess nitrogen, need-based spray": "अत्यधिक नाइट्रोजन से बचें, आवश्यकता-आधारित छिड़काव"
  },
  gj: {
    navHome: "હોમ",
    navRecommendation: "ભલામણ",
    navWeather: "હવામાન",
    navMarket: "બજાર ભાવો",
    navAbout: "વિશે",
    navContact: "સંપર્ક",
    heroTagline: "AI-સંચાલિત કૃષિ એન્જિન",
    heroHeadline: "સ્માર્ટ ખેતીના ભવિષ્યનું નિર્માણ",
    heroSubtitle: "ત્વરિત જમીનની ચકાસણી, સ્થાનિક હવામાન આગાહી, બજાર ભાવો અને કસ્ટમાઇઝ્ડ જેમિની AI ભલામણો સાથે તમારી ઉપજ વધારો.",
    heroCTAStart: "એડવાઈઝર શરૂ કરો",
    heroCTAWeather: "હવામાન જુઓ",
    heroStatDistricts: "સમર્થિત જિલ્લાઓ",
    heroStatData: "ડેટા સુસંગતતા",
    heroStatReport: "AI સલાહ રિપોર્ટ",
    formTitle: "કૃષિ પરિમાણ પ્રશ્નાવલી",
    formSubtitle: "ભલામણ મેળવવા માટે તમારો જિલ્લો, પાક અને ઋતુ પસંદ કરો.",
    formStep1: "જિલ્લો પસંદ કરો",
    formStep2: "પાક પસંદ કરો",
    formStep3: "ઋતુ પસંદ કરો",
    formSubmit: "યોજના બનાવો",
    weatherTitle: "હાલનું હવામાન",
    weatherSensible: "અનુભવાતું તાપમાન",
    weatherHumidity: "ભેજ",
    weatherWind: "પવનની ગતિ",
    weatherRain: "વરસાદની શક્યતા",
    weatherCondition: "હવામાન સ્થિતિ",
    soilTitle: "જમીનના ગુણધર્મો અને સ્વાસ્થ્ય",
    soilType: "જમીનનો પ્રકાર",
    soilTexture: "જમીનનું બંધારણ",
    soilPH: "જમીન pH",
    soilNPK: "NPK પોષક તત્વોની સ્થિતિ",
    fertilizerTitle: "ખાતર સમયપત્રક રોડમેપ",
    irrigationTitle: "સિંચાઈ સમયપત્રક",
    irrigationFreq: "આવર્તન (કેટલા દિવસે)",
    irrigationDepth: "લક્ષ્ય પાણીની ઊંડાઈ",
    diseaseTitle: "સંભવિત રોગો",
    diseaseSymptoms: "લક્ષણો",
    diseaseCure: "ઉપચાર અને ઉપાયો",
    pestTitle: "સક્રિય જીવાત જોખમો",
    pestControl: "નિયંત્રણ અને પગલાં",
    advisoryTitle: "સરકારી સલાહ અને ચેતવણીઓ",
    emptyState: "કોઈ પરિણામો લોડ થયા નથી. કૃષિ માહિતી મેળવવા માટે ઉપર આપેલું પરિમાણ ફોર્મ સબમિટ કરો.",
    weatherHeaderTitle: "પ્રાદેશિક હવામાન કેન્દ્રો",
    weatherHeaderSubtitle: "વાસ્તવિક સમયનું તાપમાન, પવનની ગતિ અને વરસાદની માહિતી મેળવવા માટે નીચેથી જિલ્લો પસંદ કરો.",
    weatherSelectLabel: "જિલ્લો",
    weatherLoading: "હવામાન માહિતી લોડ થઈ રહી છે...",
    weatherEmpty: "કોઈ જિલ્લો પસંદ કર્યો નથી. હવામાન માહિતી માટે ઉપરથી જિલ્લો પસંદ કરો.",
    marketTitle: "APMC બજાર ભાવો",
    marketSubtitle: "ગુજરાતના કૃષિ બજાર યાર્ડમાં પાકના વાસ્તવ સમયના જથ્ચાબંધ ભાવોની દેખરેખ રાખો.",
    marketLoading: "બજાર દરો મેળવી રહ્યા છે...",
    marketEmpty: "કોઈ પાક પસંદ કર્યો નથી. બજાર ભાવો મેળવવા માટે ઉપરથી પાક પસંદ કરો.",

    // Districts Translation
    "Ahmedabad": "અમદાવાદ",
    "Amreli": "અમરેલી",
    "Anand": "આણંદ",
    "Aravalli": "અરવલ્લી",
    "Banaskantha": "બનાસકાંઠા",
    "Bharuch": "ભરૂચ",
    "Bhavnagar": "ભાવનગર",
    "Botad": "બોટાદ",
    "Chhota Udaipur": "છોટાઉદેપુર",
    "Dahod": "દાહોદ",
    "Dang": "ડાંગ",
    "Devbhoomi Dwarka": "દેવભૂમિ દ્વારકા",
    "Gandhinagar": "ગાંધીનગર",
    "Gir Somnath": "ગીર સોમનાથ",
    "Jamnagar": "જામનગર",
    "Junagadh": "જૂનાગઢ",
    "Kheda": "ખેડા",
    "Kutch": "કચ્છ",
    "Mahisagar": "મહીસાગર",
    "Mehsana": "મહેસાણા",
    "Morbi": "મોરબી",
    "Narmada": "નર્મદા",
    "Navsari": "નવસારી",
    "Panchmahal": "પંચમહાલ",
    "Patan": "પાટણ",
    "Porbandar": "પોરબંદર",
    "Rajkot": "રાજકોટ",
    "Sabarkantha": "સાબરકાંઠા",
    "Surat": "સુરત",
    "Surendranagar": "સુરેન્દ્રનગર",
    "Tapi": "તાપી",
    "Vadodara": "વડોદરા",
    "Valsad": "વલસાડ",

    // Crops Translation
    "Cotton": "કપાસ",
    "Groundnut": "મગફળી",
    "Sesame": "તલ",
    "Castor": "દિવેલા (એરંડા)",
    "Wheat": "ઘઉં",
    "Bajra": "બાજરી",
    "Cumin": "જીરું",
    "Mustard": "રાઈ",
    "Gram": "ચણા",
    "Tobacco": "તંબાકુ",
    "Paddy": "ડાંગર",
    "Rice": "ચોખા",
    "Maize": "મકાઈ",
    "Banana": "કેળા",
    "Sugarcane": "શેરડી",
    "Turmeric": "હળદર",
    "Pigeon Pea": "તુવેર",
    "Mango": "કેરી",
    "Sapota": "ચીકુ",
    "Ginger": "આદુ",
    "Finger Millet": "રાગી",
    "Isabgol": "ઇસબગુલ",
    "Date Palm": "ખજૂર",
    "Soybean": "સોયાબીન",
    "Tur": "તુવેર",
    "Vegetables": "શાકભાજી",
    "Potato": "બટાકા",

    // Market Page Dynamic Crops
    "Chikoo (Sapota)": "ચીકુ",
    "Chilli": "મરચું",
    "Cumin (Jeera)": "જીરું",
    "Fennel (Variyali)": "વરિયાળી",
    "Gram (Chana)": "ચણા",
    "Guar (Cluster Bean)": "ગુવાર",
    "Onion": "ડુંગળી",
    "Castor (Divela)": "દિવેલા (એરંડા)",
    "Cotton (Kapas)": "કપાસ",
    "Groundnut (Magfali)": "મગફળી",
    "Mustard (Rai)": "રાઈ",
    "Paddy (Dangar)": "ડાંગર",
    "Sesame (Til)": "તલ",
    "Wheat (Ghau)": "ઘઉં",
    "Maize (Makai)": "મકાઈ",
    "Potato (Bataka)": "બટાકા",

    // Support Translation
    contactHeadline: "કૃષિ હેલ્પલાઇન અને સહાયતા",
    contactSubtitle: "કૃષિ નિષ્ણાતો, યુનિવર્સિટીઓ અને સરકારી સહાય પ્રણાલીઓ સાથે જોડાઓ.",
    contactTollFree: "ટોલ-ફ્રી કિસાન સપોર્ટ નંબરો",
    contactFeedbackTitle: "તકનીકી પ્રતિસાદ સબમિટ કરો",
    contactFeedbackDesc: "સિસ્ટમ સૂચનો, API ભૂલો અથવા વિકાસકર્તા પૂછપરછ માટે, અમને આના પર ઇમેઇલ કરો:",
    "Kisan Call Centre (KCC)": "કિસાન કોલ સેન્ટર (KCC)",
    "Toll-free agricultural query helpline operated by the Ministry of Agriculture.": "કૃષિ મંત્રાલય દ્વારા સંચાલિત ટોલ-ફ્રી કૃષિ પ્રશ્ન હેલ્પલાઇન.",
    "Gujarat Krishi Mahotsav Helpline": "ગુજરાત કૃષિ મહોત્સવ હેલ્પલાઇન",
    "State-sponsored advisory helpline for localized crop information.": "સ્થાનિક પાકની માહિતી માટે રાજ્ય સરકાર સંચાલિત હેલ્પલાઇન.",

    // About Translation
    aboutHeadline: "સ્માર્ટ કૃષિ વિશે",
    aboutSubtitle: "સીધા હવામાન ફીડ્સ, સ્ટ્રક્ચર્ડ ડેટાબેઝ ઇન્ડેક્સ અને જેમિની AI સાથે કૃષિ નિર્ણય સહાય પ્રણાલીઓને સશક્ત બનાવવી.",
    aboutBody: "સ્માર્ટ કૃષિ એ ડેટા-સંચાલિત કૃષિ નિર્ણય સહાયક પ્લેટફોર્મ છે. અમે ખેડૂતો માટે સચોટ માર્ગદર્શન આપવા સ્થાનિક જમીનની સ્થિતિ, પાક કેલેન્ડર અને લાઈવ હવામાનનો મેળ કરીએ છીએ.",
    aboutArchTitle: "સિસ્ટમ આર્કિટેક્ચર",
    aboutSec1Title: "ડેટાબેઝ લેયર",
    aboutSec1Desc: "વ્યાપક કૃષિ માહિતી પ્રદાન કરવા માટે જમીન, ખાતરો, સિંચાઈ પદ્ધતિઓ અને પાકના ઇતિહાસને દર્શાવતા ૧૩ મોંગોડીબી કલેક્શનનો ઉપયોગ કરે છે.",
    aboutSec2Title: "ઓપન-મેટિયો ઇન્ટિગ્રેશન",
    aboutSec2Desc: "મોંગોડીબીમાંથી મેળવેલા સ્થાનિક અક્ષાંશ/રેખાંશ આધારે કોઈ પણ વધારાના એપીઆઈ વગર લાઈવ હવામાન અને ૭-દિવસની આગાહી મેળવે છે.",
    aboutSec3Title: "ગૂગલ જેમિની AI એન્જિન",
    aboutSec3Desc: "ખેડૂતો માટે સચોટ વિશ્લેષણ, કરો અને ન કરોની ચેકલિસ્ટ તૈયાર કરવા માટે પર્યાવરણીય ડેટા, પાક વિગતો અને હવામાન ચેતવણીઓ જેમિની AI મોડેલને મોકલે છે.",

    // Soil & Details translation
    "Medium Black / Alluvial": "મધ્યમ કાળી / કાંપની",
    "Medium Black": "મધ્યમ કાળી",
    "Alluvial": "કાંપની",
    "Sandy loam": "ગોરાડુ (રેતાળ લોમ)",
    "Sandy": "રેતાળ",
    "Clayey": "ચીકણી",
    "Loamy": "ગોરાડુ",
    "Black cotton soil": "કાળી કપાસી જમીન",
    "Sandy Clay Loam": "રેતાળ ચીકણી લોમ",
    "Sandy Clay": "રેતાળ ચીકણી",
    "Clay Loam": "ચીકણી લોમ",
    "Clay": "ચીકણી",
    "Loam": "ગોરાડુ",
    "High": "ઉચ્ચ",
    "Medium": "મધ્યમ",
    "Moderate": "મધ્યમ",
    "Low": "નિમ્ન",
    "Critical": "ગંભીર",
    "Optimal": "અનુકૂળ",

    // Common WMO weather conditions
    "OVERCAST": "વાદળછાયું",
    "Overcast": "વાદળછાયું",
    "Partly Cloudy": "આંશિક વાદળછાયું",
    "Clear": "સ્વચ્છ તડકો",
    "Sunny": "સ્વચ્છ તડકો",
    "Rainy": "વરસાદ",
    "Cloudy": "વાદળછાયું",

    // Weekdays
    "Today": "આજે",
    "Tomorrow": "આવતીકાલે",
    "Monday": "સોમવાર",
    "Tuesday": "મંગળવાર",
    "Wednesday": "બુધવાર",
    "Thursday": "ગુરુવાર",
    "Friday": "શુક્રવાર",
    "Saturday": "શનિવાર",
    "Sunday": "રવિવાર",
    "Mon": "સોમ",
    "Tue": "મંગળ",
    "Wed": "બુધ",
    "Thu": "ગુરુ",
    "Fri": "શુક્ર",
    "Sat": "શનિ",
    "Sun": "રવિ",
    "WEATHER": "હવામાન",
    "IRRIGATION": "સિંચાઈ",
    "DISEASE": "રોગ",
    "Weather": "હવામાન",
    "Irrigation": "સિંચાઈ",
    "Disease": "રોગ",

    // Advisories
    "Every 15-20 Days": "દર ૧૫-૨૦ દિવસે",
    "Every 10-12 Days": "દર ૧૦-૧૨ દિવસે",
    "Every 7-8 Days": "દર ૭-૮ દિવસે",
    "Rain probability > 70%: Skip irrigation today.": "વરસાદની સંભાવના > ૭૦%: આજે સિંચાઈ મુલતવી રાખો.",
    "Humidity > 85%: High fungal disease risk.": "ભેજ > ૮૫%: ફૂગના રોગનું ઊંચું જોખમ.",
    "Stable conditions expected; maintain regular irrigation and nutrient schedule.": "સ્થિર પરિસ્થિતિની અપેક્ષા છે; નિયમિત સિંચાઈ અને પોષક તત્વોનું આયોજન જાળવો.",
    "Monsoon showers expected; avoid irrigation and fertilizer application before rainfall.": "ચોમાસાના વરસાદની સંભાવના છે; વરસાદ પહેલાં સિંચાઈ અને ખાતર આપવાનું ટાળો.",
    "Avoid overhead watering if rain is forecast.": "જો વરસાદની આગાહી હોય તો ઉપરથી પાણી છાંટવાનું ટાળો.",
    "Do not apply fertilizers right before heavy rains.": "ભારે વરસાદ પહેલાં ખાતર આપશો નહીં.",

    // Fertilizers
    "Basal": "પાયાનો (વાવણી સમયનો)",
    "Vegetative": "વાનસ્પતિક વૃદ્ધિ",
    "Flowering": "ફૂલ આવવાના સમયે",
    "DAP": "ડીએપી (DAP)",
    "Urea": "યુરિયા",
    "MOP": "એમઓપી (MOP)",
    "FYM": "સેન્દ્રીય ખાતર (FYM)",
    "SSP": "એસએસપી (SSP)",
    "100 kg/hectare": "૧૦૦ કિગ્રા/હેક્ટર",
    "50 kg/hectare": "૫૦ કિગ્રા/હેક્ટર",
    "40 kg/hectare": "૪૦ કિગ્રા/હેક્ટર",

    // Diseases
    "Late Blight": "મોડો સુકારો (લેટ બ્લાઇટ)",
    "Water-soaked lesions turning brown/black on leaves": "પાંદડા પર પાણી જેવા લવચીક ડાઘ જે કાળા/કથ્થઈ રંગના થઈ જાય છે",
    "Follow recommended cultural/chemical control for Late Blight; consult local Krishi Vigyan Kendra for exact fungicide/dose.": "મોડા સુકારા માટે ભલામણ કરેલ જૈવિક/રાસાયણિક પગલાં લો; ચોક્કસ ફૂગનાશક/ડોઝ માટે સ્થાનિક કૃષિ વિજ્ઞાન કેન્દ્રનો સંપર્ક કરો.",
    "Angular water-soaked leaf spots": "પાંદડા પર ખૂણાવાળા પાણી જેવા ડાઘ",
    "black lesions on bolls": "જીંડવા પર કાળા ચાઠા",
    "Follow recommended cultural/chemical control for Bacterial Blight; consult local Krishi Vigyan Kendra for exact fungicide/dose.": "બેક્ટેરિયલ બ્લાઇટ માટે ભલામણ કરેલ જૈવિક/રાસાયણિક પગલાં લો; ચોક્કસ ફૂગનાશક/ડોઝ માટે સ્થાનિક કૃષિ વિજ્ઞાન કેન્દ્રનો સંપર્ક કરો.",
    "Sudden wilting": "એકાએક મુરઝાઈ જવું",
    "grey fungal growth at collar": "થડના ભાગે રાખોડી રંગની ફૂગ વળવી",
    "Follow recommended cultural/chemical control for Grey Mildew (Root Rot); consult local Krishi Vigyan Kendra for exact fungicide/dose.": "રાખોડી ફૂગ (મૂળના સડવા) માટે ભલામણ કરેલ જૈવિક/રાસાયણિક પગલાં લો; ચોક્કસ ફૂગનાશક/ડોઝ માટે સ્થાનિક કૃષિ વિજ્ઞાન કેન્દ્રનો સંપર્ક કરો.",
    "Blast": "ખીરું (બ્લાસ્ટ)",
    "Spindle-shaped lesions on leaves, neck rot": "પાંદડા પર ત્રાક આકારના ચાઠા અને ડૂંડીનો સડો",
    "Bacterial Leaf Blight": "બેક્ટેરિયલ લીફ બ્લાઇટ (પાંદડાનો સુકારો)",
    "Water-soaked streaks turning yellow/white": "પાંદડા પર પાણી જેવા લંબગોળ ડાઘ પીળા/સફેદ થઈ જવા",

    // Pests
    "Pink Bollworm": "ગુલાબી ઈયળ (પિંક બોલવોર્મ)",
    "Pheromone traps, timely picking, resistant hybrids": "ફેરોમોન ટ્રેપ, સમયસર વીણી, પ્રતિકારક હાઇબ્રિડ જાતો",
    "Whitefly": "સફેદ માખી",
    "Yellow sticky traps, neem-based sprays": "પીળા ચીકણા ટ્રેપ, લીમડા આધારિત છંટકાવ",
    "Aphid": "મોલો-મશી (એફિડ)",
    "Need-based spray, use certified seed": "જરૂરિયાત મુજબ છંટકાવ, પ્રમાણિત બિયારણનો ઉપયોગ",
    "7-Day Weather Forecast & Trends": "૭-દિવસીય હવામાન આગાહી અને પ્રવાહો",
    "Stem Borer": "ગાભમારાની ઈયળ",
    "Pheromone traps, balanced fertilization": "ફેરોમોન ટ્રેપ અને સંતુલિત ખાતરનો ઉપયોગ",
    "Brown Plant Hopper": "મૂડીયું (બ્રાઉન પ્લાન્ટ હોપર)",
    "Avoid excess nitrogen, need-based spray": "વધારે નાઇટ્રોજનનો વપરાશ ટાળવો અને જરૂરિયાત મુજબ છંટકાવ કરવો"
  }
};

export const getTranslation = (lang, key) => {
  const currentLang = lang || 'en';
  if (!key) return '';
  
  // Clean up whitespace/newlines from backend database records to match dictionary keys
  const cleanKey = String(key).trim().replace(/\s+/g, ' ');
  
  // 1. Check exact dictionary match first
  if (translations[currentLang]?.[cleanKey]) {
    return translations[currentLang][cleanKey];
  }
  
  // Case-insensitive exact match fallback
  const exactKeyMatch = Object.keys(translations[currentLang] || {}).find(
    k => k.toLowerCase() === cleanKey.toLowerCase()
  );
  if (exactKeyMatch) {
    return translations[currentLang][exactKeyMatch];
  }

  // 2. Dynamic summary template 1:
  // "Current conditions in [District] are suitable for cultivating [Crop]. Please monitor weather changes closely."
  const summaryRegex = /^Current conditions in (.+) are suitable for cultivating (.+)\. Please monitor weather changes closely\.$/i;
  const matchSummary = cleanKey.match(summaryRegex);
  if (matchSummary) {
    const dist = matchSummary[1].trim();
    const crp = matchSummary[2].trim();
    const translatedDist = getTranslation(lang, dist);
    const translatedCrp = getTranslation(lang, crp);
    if (currentLang === 'hi') {
      return `${translatedDist} में वर्तमान परिस्थिति ${translatedCrp} की खेती के लिए उपयुक्त है। कृपया मौसम के बदलावों पर ध्यान दें।`;
    }
    if (currentLang === 'gj') {
      return `${translatedDist}માં હાલની પરિસ્થિતિઓ ${translatedCrp}ની ખેતી માટે અનુકૂળ છે. કૃપા કરીને હવામાનના ફેરફારો પર નજીકથી નજર રાખો.`;
    }
  }

  // 3. Dynamic summary template 2:
  // "Current soil ([SoilType]) and [Season] conditions in [District] are generally suitable for [Crop] cultivation."
  const summaryRegex2 = /^Current soil \((.+)\) and (.+) conditions in (.+) are generally suitable for (.+) cultivation\.$/i;
  const matchSummary2 = cleanKey.match(summaryRegex2);
  if (matchSummary2) {
    const soil = matchSummary2[1].trim();
    const season = matchSummary2[2].trim();
    const dist = matchSummary2[3].trim();
    const crp = matchSummary2[4].trim();
    const translatedSoil = getTranslation(lang, soil);
    const translatedSeason = getTranslation(lang, season);
    const translatedDist = getTranslation(lang, dist);
    const translatedCrp = getTranslation(lang, crp);
    if (currentLang === 'hi') {
      return `${translatedDist} में वर्तमान मिट्टी (${translatedSoil}) और ${translatedSeason} की स्थिति आमतौर पर ${translatedCrp} की खेती के लिए उपयुक्त है।`;
    }
    if (currentLang === 'gj') {
      return `${translatedDist}માં હાલની જમીન (${translatedSoil}) અને ${translatedSeason} ઋતુ સામાન્ય રીતે ${translatedCrp}ની ખેતી માટે અનુકૂળ છે.`;
    }
  }

  // 4. Dynamic fertilizer template:
  // "Apply recommended fertilizer schedule: [Fertilizers]."
  const fertRegex = /^Apply recommended fertilizer schedule: (.+)\.$/i;
  const matchFert = cleanKey.match(fertRegex);
  if (matchFert) {
    const ferts = matchFert[1].trim();
    if (currentLang === 'hi') {
      return `अनुशंसित उर्वरक अनुसूची लागू करें: ${ferts}।`;
    }
    if (currentLang === 'gj') {
      return `ભલામણ કરેલ ખાતર સમયપત્રક લાગુ કરો: ${ferts}.`;
    }
  }

  // 5. Dynamic irrigation template:
  // "Apply irrigation as required: [Frequency]."
  const irrRegex = /^Apply irrigation as required: (.+)\.$/i;
  const matchIrr = cleanKey.match(irrRegex);
  if (matchIrr) {
    const freq = matchIrr[1].trim();
    const translatedFreq = getTranslation(lang, freq);
    if (currentLang === 'hi') {
      return `आवश्यकतानुसार सिंचाई करें: ${translatedFreq}।`;
    }
    if (currentLang === 'gj') {
      return `જરૂરિયાત મુજબ સિંચાઈ કરો: ${translatedFreq}.`;
    }
  }

  // 6. Dynamic solution template:
  // "Follow recommended cultural/chemical control for [Disease]; consult local Krishi Vigyan Kendra for exact fungicide/dose."
  const solutionRegex = /^Follow recommended cultural\/chemical control for (.+); consult local Krishi Vigyan Kendra for exact fungicide\/dose\.$/i;
  const matchSolution = cleanKey.match(solutionRegex);
  if (matchSolution) {
    const diseaseName = matchSolution[1].trim();
    const translatedDisease = getTranslation(lang, diseaseName);
    if (currentLang === 'hi') {
      return `${translatedDisease} के लिए अनुशंसित सांस्कृतिक/रासायनिक नियंत्रण का पालन करें; सटीक कवकनाशी/खुराक के लिए स्थानीय कृषि विज्ञान केंद्र से संपर्क करें।`;
    }
    if (currentLang === 'gj') {
      return `${translatedDisease} રોગ માટે ભલામણ કરેલ જૈવિક/રાસાયણિક પગલાં લો; ચોક્કસ ફૂગનાશક/ડોઝ માટે સ્થાનિક કૃષિ વિજ્ઞાન કેન્દ્રનો સંપર્ક કરો.`;
    }
  }

  return key;
};

export default translations;
