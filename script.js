const API_key ="90fa112b0c274cf69240b385d00a7bca";
let searchbtn = document.querySelector('[Search-btn]');
let whetherBtn = document.querySelector('[Current-whetherTab]');
let fetchSearchContainer = document.querySelector(`[data-searchForm]`);
let fetchLoactionDiv = document.querySelector('[location-Grant]');
let fetchWhetherDiv = document.querySelector('[WhetherInfoDisplay]');
console.log(fetchWhetherDiv);
let loaderDiv = document.querySelector('[loaderContainer]');
let errorInfo = document.querySelector('[error-404]');
let currentTab=whetherBtn;
whetherBtn.classList.add('current-Tab');
getfromSessionStorage();

function switchTab(clickedtab)
{
if(currentTab!=clickedtab)
{
  currentTab.classList.remove('current-Tab');
  currentTab=clickedtab;
  currentTab.classList.add('current-Tab');
}
if(!fetchSearchContainer.classList.contains('active'))
{
  fetchLoactionDiv.classList.remove('active');
  fetchWhetherDiv.classList.remove('active');
  fetchSearchContainer.classList.add('active');
}

else
{
  fetchSearchContainer.classList.remove('active');
  fetchWhetherDiv.classList.remove('active');
  errorInfo.classList.remove('active');
  getfromSessionStorage();
}

}

whetherBtn.addEventListener('click',()=>
{
  switchTab(whetherBtn);
});


searchbtn.addEventListener('click',()=>
{
  switchTab(searchbtn);
})

function getfromSessionStorage()
{
  const localcoordinates= sessionStorage.getItem("user-coordinates");
  if(!localcoordinates)
  {
    fetchLoactionDiv.classList.add('active');
  }
  else{
  let coordinates = JSON.parse(localcoordinates);
  fetchuserWhetherInfo(coordinates);
  }
}

async function fetchuserWhetherInfo(coordinates)
{
  let {lat,lon} = coordinates;
  fetchLoactionDiv.classList.remove('active');
  loaderDiv.classList.add('active');
  try
  {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);
    let data = await response.json();
    loaderDiv.classList.remove('active');
    fetchWhetherDiv.classList.add('active');
    renderWhetherInfo(data); 
  }catch(err)
  {
    loaderDiv.classList.remove('active');
    errorInfo.classList.add('active');
  }
 }

 function renderWhetherInfo(WhetherInfo)
 {
  let nameCity = document.querySelector('[City-Name]');
    let flag = document.querySelector('[data-country]');
    let WhetherDesc = document.querySelector('[data-weatherDesc]');
    let dataIcon = document.querySelector('[data-weatherIcon]');
    let fetchTemp = document.querySelector('[data-temp]');
    let fetchWind = document.querySelector('[data-windSpeed]');
    let fetchClouds = document.querySelector('[data-Humidity]');
    let fetchHumidity = document.querySelector('[data-clouds]');
   
    nameCity.innerText = WhetherInfo?.name;
    flag.src=`https://flagcdn.com/144x108/${WhetherInfo?.sys?.country?.toLowerCase()}.png`;
    WhetherDesc.innerText = WhetherInfo?.weather?.[0]?.description;
    dataIcon.src = `https://openweathermap.org/img/w/${WhetherInfo?.weather?.[0]?.icon}.png`;
    fetchTemp.innerText = `${WhetherInfo?.main?.temp} °C`;
    fetchWind.innerText = `${WhetherInfo?.wind?.speed} m/s`;
    fetchClouds.innerText =`${ WhetherInfo?.clouds?.all} %`;
    fetchHumidity.innerText = `${WhetherInfo?.main?.humidity} %`;

}

function getlocation()
{
if(navigator.geolocation)
{
  navigator.geolocation.getCurrentPosition(showPosition);
}
else
{
  alert("Geolocation not supportable"); 
}
}
function showPosition(position)
{ 
  const userCoordinates = 
  {
    lat:position.coords.latitude,
    lon:position.coords.longitude
  }
  sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
  fetchuserWhetherInfo(userCoordinates);
}

let fetchBtn = document.querySelector('[location-acessBtn]');
fetchBtn.addEventListener('click',getlocation);

let fetchInputField = document.querySelector('[dataInput]');
fetchSearchContainer.addEventListener('submit',(e)=>
{
  e.preventDefault();
  let cityName = fetchInputField.value;
  if(cityName === "" || cityName === false)
  {
    fetchWhetherDiv.classList.remove('active');

    errorInfo.classList.add('active'); 

  }
  
else
  fetchSearchWhetherInfo(cityName);
})

async function fetchSearchWhetherInfo(city)
{
  loaderDiv.classList.add('active');
  fetchWhetherDiv.classList.remove('active');
  fetchLoactionDiv.classList.remove('active');
  try
  {
    let fetchCityApi = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);
    let data = await fetchCityApi.json();
    loaderDiv.classList.remove('active');
    fetchWhetherDiv.classList.add('active');
    renderWhetherInfo(data);
  }catch(err)
  {
    loaderDiv.classList.remove('active');
    errorInfo.classList.add('active');
  }
}








