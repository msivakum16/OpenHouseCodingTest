import express from 'express';
import ejs from 'ejs';
import axios from 'axios';

class commData{
	name: string;
	url: string;
	homeAvg: number;
	constructor(name: string, url: string, homeAvg: number){
		this.name = name;
		this.url = url;
		this.homeAvg = homeAvg;
	}
}




let count: number = 0;
let sum: number = 0;
let avg: number = 0;


const app = express();
app.set("view engine","ejs");
app.use(express.static("public"));
/*app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})*/


let one = "https://a18fda49-215e-47d1-9dc6-c6136a04a33a.mock.pstmn.io/communities";
let two = "https://a18fda49-215e-47d1-9dc6-c6136a04a33a.mock.pstmn.io/homes"

const requestOne = axios.get(one);
const requestTwo = axios.get(two);

app.get("/show", async (req,res,next) => {
	let dataArray: commData[] = [];
	await axios.all([requestOne, requestTwo])
	.then((axios.spread((...responses) => {
		// handle success
		const communities = responses[0].data;
  		const homes = responses[1].data;
		//console.log(communities);
		//console.log(homes);
		communities.forEach((community)=>{
			sum = 0;
			count = 0;
			let name = community["name"];
			let url = community["imgUrl"];
			if(url === ''){
				url = "https://envision.design/wp-content/uploads/2019/12/image-coming-soon.jpg"
			}
			homes.forEach((home)=>{
				if(community["id"] === home["communityId"]){
					count += 1;
					if(count > 1){
						sum += home["price"];	
					}
					else{
						sum = home["price"];
					}
				}
			});
			if(count > 0){
				avg = Math.round(sum / count);
				//homeAvg.push(Math.round(avg));
			}
			else{
				avg = 0;
			}
			let data = new commData(name, url, avg);
			dataArray.push(data);
		});
		let arr = sortArr(dataArray);
		
		res.render("show",{communities:arr});
	})))
	.catch(err=>console.log(err));
});



		  
app.get("/show",(req,res)=>{
	
});

app.listen(3000, () => {
	console.log("App started on PORT 3000");
});


function sortArr(arr){
	let byName = arr.slice(0);
	byName.sort(function(a,b) {
    let x = a.name.toLowerCase();
    let y = b.name.toLowerCase();
    return x < y ? -1 : x > y ? 1 : 0;
});
	return byName
}
