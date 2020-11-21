"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
class commData {
    constructor(name, url, homeAvg) {
        this.name = name;
        this.url = url;
        this.homeAvg = homeAvg;
    }
}
let count = 0;
let sum = 0;
let avg = 0;
const app = express_1.default();
app.set("view engine", "ejs");
app.use(express_1.default.static("public"));
/*app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})*/
let one = "https://a18fda49-215e-47d1-9dc6-c6136a04a33a.mock.pstmn.io/communities";
let two = "https://a18fda49-215e-47d1-9dc6-c6136a04a33a.mock.pstmn.io/homes";
const requestOne = axios_1.default.get(one);
const requestTwo = axios_1.default.get(two);
app.get("/show", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let dataArray = [];
    yield axios_1.default.all([requestOne, requestTwo])
        .then((axios_1.default.spread((...responses) => {
        // handle success
        const communities = responses[0].data;
        const homes = responses[1].data;
        //console.log(communities);
        //console.log(homes);
        communities.forEach((community) => {
            sum = 0;
            count = 0;
            let name = community["name"];
            let url = community["imgUrl"];
            if (url === '') {
                url = "https://envision.design/wp-content/uploads/2019/12/image-coming-soon.jpg";
            }
            homes.forEach((home) => {
                if (community["id"] === home["communityId"]) {
                    count += 1;
                    if (count > 1) {
                        sum += home["price"];
                    }
                    else {
                        sum = home["price"];
                    }
                }
            });
            if (count > 0) {
                avg = Math.round(sum / count);
                //homeAvg.push(Math.round(avg));
            }
            else {
                avg = 0;
            }
            let data = new commData(name, url, avg);
            dataArray.push(data);
        });
        let arr = sortArr(dataArray);
        res.render("show", { communities: arr });
    })))
        .catch(err => console.log(err));
}));
app.get("/show", (req, res) => {
});
app.listen(3000, () => {
    console.log("App started on PORT 3000");
});
function sortArr(arr) {
    let byName = arr.slice(0);
    byName.sort(function (a, b) {
        let x = a.name.toLowerCase();
        let y = b.name.toLowerCase();
        return x < y ? -1 : x > y ? 1 : 0;
    });
    return byName;
}
//# sourceMappingURL=app.js.map