(function(global) {
    var Elements = global.Elements = {
        panorama: {
            imgURL: 'assets/img/0-without-layers.jpg',
            notElement: true
        },
        shish: {
            lat: 3.199999999,
            lon: 223.6,
            imgURL: "assets/img/ShishaMan.png",
            name: "shish",
            x: -220,
            z: -241,
            y: -3,
            ry: 4,
            rx: 0,
            rz: 0,
            width: 250,
            height: 250,
            sx: 1,
            sy: 1,
            modal: 'shish',
            title: "Facts"
        },
        car: {
            lat: -2.5000,
            lon: -45.30000,
            imgURL: "assets/img/eatingCar.png",
            name: "car",
            x: 240,
            z: -283,
            y: -1,
            ry: -7,
            rx: 0,
            rz: 0,
            width: 250,
            height: 300,
            sx: 1,
            sy: 1,
            images: ["fata.jpg", "Koshary.jpg", "Falafel.jpg", "Molokheya.jpg", "Mahshy.jpg", "desert.jpg"],
            title: "Food"
        },
        gt: {
            lat: 0.8999100000000001,
            lon: -11.1000001,
            imgURL: "assets/img/GT.png",
            name: "gt",
            x: 387,
            z: -133,
            y: 40,
            ry: 2,
            rx: 0,
            rz: 0,
            width: 150,
            height: 200,
            sx: 1,
            sy: 1,
            logo: "rise_up",
            images: ["Riseup.jpg"],
            title: "Rise up",
            opportunities: {
                "Rise_up": [
                    "https://opportunities.aiesec.org/opportunity/738256",
                    "https://opportunities.aiesec.org/opportunity/741149",
                    "https://opportunities.aiesec.org/opportunity/738265",
                    "https://opportunities.aiesec.org/opportunity/734361",
                    "https://opportunities.aiesec.org/opportunity/736730",
                    "https://opportunities.aiesec.org/opportunity/725075",
                    "https://opportunities.aiesec.org/opportunity/734641",
                    "https://opportunities.aiesec.org/opportunity/742684",
                    "https://opportunities.aiesec.org/opportunity/742767",
                    "https://opportunities.aiesec.org/opportunity/733368",
                    "https://opportunities.aiesec.org/opportunity/726802",
                    "https://opportunities.aiesec.org/opportunity/734702",
                    "https://opportunities.aiesec.org/opportunity/728382",
                    "https://opportunities.aiesec.org/opportunity/739730",
                    "https://opportunities.aiesec.org/opportunity/742230"
                ]
            }
        },
        ge: {
            lat: 0.9999100000000001,
            lon: 4.5999999,
            imgURL: "assets/img/GE.png",
            name: "ge",
            x: 366,
            z: 40,
            y: 38,
            ry: -5,
            rx: 0,
            rz: 0,
            width: 70,
            height: 120,
            sx: 1,
            sy: 1,
            logo: "light_up",
            images: ["Lightup.jpg"],
            title: "Light up",
            opportunities: {
                "Light_up": [
                    "https://opportunities.aiesec.org/opportunity/728412",
                    "https://opportunities.aiesec.org/opportunity/728411",
                    "https://opportunities.aiesec.org/opportunity/741623",
                    "https://opportunities.aiesec.org/opportunity/734926"
                ]
            }
        },
        pyramid: {
            lat: 8.29991,
            lon: 44.199999989999995,
            imgURL: "assets/img/camel.png",
            name: "pyramid",
            x: 322,
            z: 279,
            y: 64,
            ry: -2,
            rx: 0,
            rz: 0,
            width: 50,
            height: 50,
            sx: 0.7,
            sy: 0.7,
            images: ["Pyramids.jpg", "Qarun.jpg", "Valleyofthekings.jpg", "StCatherine.jpg", "Karnak.jpg"],
            title: "History"
        },
        tan: {
            lat: 6.19991,
            lon: 60.29999999,
            imgURL: "assets/img/tanoura.png",
            name: "tan",
            x: 259,
            y: 36,
            z: 389,
            ry: -9,
            rx: 0,
            rz: 0,
            width: 250,
            height: 200,
            sx: 1,
            sy: 1,
            images: ["Culture.jpg", "run.jpg", "TheCity.jpg", "Tanoura+Music.jpg", "BellyDancer.jpg", "Music.jpg"],
            title: "Culture"
        },
        poverty: {
            logo: "enable",
            lat: -0.20009,
            lon: 83.2999,
            imgURL: "assets/img/Poverty.png",
            name: "poverty",
            x: 64,
            z: 454,
            y: 53,
            ry: -34,
            rx: 0,
            rz: 0,
            width: 200,
            height: 200,
            sx: 1,
            sy: 1,
            images: ["OEP_3204.jpg"],
            video: "enable",
            sources: {
                enable: [{
                    path: 'AIESEC_Enable_project.webm',
                    type: 'video/webm'
                }, {
                    path: 'AIESEC_Enable_project_360.mp4',
                    type: 'video/mp4'
                }, {
                    path: 'AIESEC_Enable_project_720.mp4',
                    type: 'video/mp4'
                }]
            },
            title: "Enable",
            opportunities: {
                "Creative_recycling": [
                    "https://opportunities.aiesec.org/opportunity/721789",
                    "https://opportunities.aiesec.org/opportunity/724571",
                    "https://opportunities.aiesec.org/opportunity/724583",
                    "https://opportunities.aiesec.org/opportunity/738683",
                    "https://opportunities.aiesec.org/opportunity/738684",
                    "https://opportunities.aiesec.org/opportunity/731918",
                    "https://opportunities.aiesec.org/opportunity/736599"
                ],
                "Others": [
                    "https://opportunities.aiesec.org/opportunity/734437",
                    "https://opportunities.aiesec.org/opportunity/738241"
                ],
                "Marketing": [
                    "https://opportunities.aiesec.org/opportunity/738240",
                    "https://opportunities.aiesec.org/opportunity/733726",
                    "https://opportunities.aiesec.org/opportunity/730564",
                    "https://opportunities.aiesec.org/opportunity/739434",
                    "https://opportunities.aiesec.org/opportunity/740695"
                ]
            }
        },
        women: {
            logo: "empower",
            lat: 4.299989999999999,
            lon: 116.49999,
            imgURL: "assets/img/Women.png",
            name: "women",
            x: -176,
            z: 409,
            y: 40.5,
            ry: -63,
            rx: 0,
            rz: 0,
            width: 200,
            height: 200,
            sx: 1,
            sy: 1,
            images: ["OEP_3235.jpg"],
            video: "empower",
            sources: {
                empower: [{
                    path: 'AIESEC_Empower_project.webm',
                    type: 'video/webm'
                }, {
                    path: 'AIESEC_Empower_project_360.mp4',
                    type: 'video/mp4'
                }, {
                    path: 'AIESEC_Empower_project_720.mp4',
                    type: 'video/mp4'
                }]
            },
            title: "Empower",
            opportunities: {
                "Research_opportunity": [
                    "https://opportunities.aiesec.org/opportunity/737907",
                    "https://opportunities.aiesec.org/opportunity/737885",
                    "https://opportunities.aiesec.org/opportunity/737878",
                    "https://opportunities.aiesec.org/opportunity/736338",
                    "https://opportunities.aiesec.org/opportunity/725288",
                    "https://opportunities.aiesec.org/opportunity/725293"
                ],
                "Marketing": [
                    "https://opportunities.aiesec.org/opportunity/725291",
                    "https://opportunities.aiesec.org/opportunity/725287",
                    "https://opportunities.aiesec.org/opportunity/727805",
                    "https://opportunities.aiesec.org/opportunity/727805"
                ],
                "Trainer": [
                    "https://opportunities.aiesec.org/opportunity/727805",
                    "https://opportunities.aiesec.org/opportunity/737819",
                    "https://opportunities.aiesec.org/opportunity/738734",
                    "https://opportunities.aiesec.org/opportunity/738857",
                    "https://opportunities.aiesec.org/opportunity/738747",
                    "https://opportunities.aiesec.org/opportunity/738749"
                ],
                "Event_planning": [
                    "https://opportunities.aiesec.org/opportunity/733746",
                    "https://opportunities.aiesec.org/opportunity/733746",
                    "https://opportunities.aiesec.org/opportunity/736254",
                    "https://opportunities.aiesec.org/opportunity/736417"
                ]
            }
        },
        explore: {
            logo: "explore",
            lat: 12.0009,
            lon: 151.8999,
            imgURL: "assets/img/explorer.png",
            name: "explore",
            x: -392,
            z: 226,
            y: 64,
            ry: 2,
            rx: 0,
            rz: 0,
            width: 150,
            height: 150,
            sx: 1,
            sy: 1,
            images: ["Explore_c.jpg"],
            video: "explore",
            sources: {
                explore: [{
                    path: 'AIESEC_Explore_project.webm',
                    type: 'video/webm'
                }, {
                    path: 'AIESEC_Explore_project_360.mp4',
                    type: 'video/mp4'
                }, {
                    path: 'AIESEC_Explore_project_720.mp4',
                    type: 'video/mp4'
                }]
            },
            title: "Explore",
            opportunities: {
                "Promoting_tourism": [
                    "https://opportunities.aiesec.org/opportunity/740593",
                    "https://opportunities.aiesec.org/opportunity/736331",
                    "https://opportunities.aiesec.org/opportunity/723960",
                    "https://opportunities.aiesec.org/opportunity/731932",
                    "https://opportunities.aiesec.org/opportunity/738275",
                    "https://opportunities.aiesec.org/opportunity/733710",
                    "https://opportunities.aiesec.org/opportunity/726728",
                    "https://opportunities.aiesec.org/opportunity/728527",
                    "https://opportunities.aiesec.org/opportunity/736437",
                    "https://opportunities.aiesec.org/opportunity/724223",
                    "https://opportunities.aiesec.org/opportunity/727325"
                ]
            }
        },
        teacher: {
            logo: "enlighten",
            lat: 3.3999999000000014,
            lon: -169.01000000000002,
            imgURL: "assets/img/teach.png",
            name: "teacher",
            x: -436,
            z: -3,
            y: 62,
            ry: -18,
            rx: 0,
            rz: 0,
            width: 250,
            height: 200,
            sx: 1,
            sy: 1,
            images: ["OEP_0223.jpg"],
            video: "enlighten",
            sources: {
                enlighten: [{
                    path: 'AIESEC_Enlighten_project.webm',
                    type: 'video/webm'
                }, {
                    path: 'AIESEC_Enlighten_project_360.mp4',
                    type: 'video/mp4'
                }, {
                    path: 'AIESEC_Enlighten_project_720.mp4',
                    type: 'video/mp4'
                }]
            },
            title: "Enlighten",
            opportunities: {
                "Teaching_Opportunity": [
                    "https://opportunities.aiesec.org/opportunity/718496",
                    "https://opportunities.aiesec.org/opportunity/721110",
                    "https://opportunities.aiesec.org/opportunity/721096",
                    "https://opportunities.aiesec.org/opportunity/729167",
                    "https://opportunities.aiesec.org/opportunity/725248",
                    "https://opportunities.aiesec.org/opportunity/735150",
                    "https://opportunities.aiesec.org/opportunity/729853",
                    "https://opportunities.aiesec.org/opportunity/735126",
                    "https://opportunities.aiesec.org/opportunity/743846",
                    "https://opportunities.aiesec.org/opportunity/736487",
                    "https://opportunities.aiesec.org/opportunity/724591",
                    "https://opportunities.aiesec.org/opportunity/735475",
                    "https://opportunities.aiesec.org/opportunity/736054",
                    "https://opportunities.aiesec.org/opportunity/726866",
                    "https://opportunities.aiesec.org/opportunity/733732",
                    "https://opportunities.aiesec.org/opportunity/719260",
                    "https://opportunities.aiesec.org/opportunity/726096"
                ],
                "Marketing": [
                    "https://opportunities.aiesec.org/opportunity/728859",
                    "https://opportunities.aiesec.org/opportunity/740646",
                    "https://opportunities.aiesec.org/opportunity/740474",
                    "https://opportunities.aiesec.org/opportunity/740502",
                    "https://opportunities.aiesec.org/opportunity/730807",
                    "https://opportunities.aiesec.org/opportunity/737478",
                    "https://opportunities.aiesec.org/opportunity/725905",
                    "https://opportunities.aiesec.org/opportunity/728493",
                    "https://opportunities.aiesec.org/opportunity/734426",
                    "https://opportunities.aiesec.org/opportunity/732820",
                    "https://opportunities.aiesec.org/opportunity/728160"
                ],
                "IT": [
                    "https://opportunities.aiesec.org/opportunity/736894",
                    "https://opportunities.aiesec.org/opportunity/736256",
                    "https://opportunities.aiesec.org/opportunity/736430",
                    "https://opportunities.aiesec.org/opportunity/736435",
                    "https://opportunities.aiesec.org/opportunity/732419",
                    "https://opportunities.aiesec.org/opportunity/730866",
                    "https://opportunities.aiesec.org/opportunity/730865"
                ],
                "Event_planning": [
                    "https://opportunities.aiesec.org/opportunity/724241",
                    "https://opportunities.aiesec.org/opportunity/728815",
                    "https://opportunities.aiesec.org/opportunity/728809",
                    "https://opportunities.aiesec.org/opportunity/724749",
                    "https://opportunities.aiesec.org/opportunity/740636"
                ]
            }
        },
        egypt: {
            lat: 43,
            lon: 210,
            imgURL: "assets/img/Egypt.png",
            name: "egypt",
            x: -229,
            z: -121,
            y: 324,
            ry: -500,
            rx: -197,
            rz: 172,
            width: 200,
            height: 200,
            sx: 1,
            sy: 1,
            modal: 'egypt',
            title: "Documentary"
        },
        plane: {
            imgURL: "assets/img/plane.png",
            name: "plane",
            lat: 100,
            lon: 220,
            x: 31,
            z: -23,
            y: 302,
            ry: 85,
            rx: -77,
            rz: -45,
            width: 100,
            height: 100,
            sx: 1,
            sy: 1,
            modal: 'plane',
            title: "Travel"
        },
        // habibi: { imgURL: "assets/img/Explore.png", name: "habibi", x: -272, z: 64, y: -337, ry: 31, rx: -110, rz: 118, width: 100, height: 100, sx: 0.5, sy: 0.5 }
    };
})(window);
