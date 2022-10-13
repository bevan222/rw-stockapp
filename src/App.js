import { useState, useEffect, useRef } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import firebase from 'firebase/compat/app';
import { getAuth } from "firebase/auth";
import "firebase/compat/database";
import firebaseConfig from '../src/component/firebaseConfig';
import PriceChart from "./component/PriceChart";
import {signInWithEmailAndPassword } from "firebase/auth";



async function fetchData(setStockData, searchData, db, setNoteData, setStockInformation, firstRender, isFetch) {
  const res = await fetch('https://api.fugle.tw/marketdata/v0.3/candles?symbolId='+searchData.current.stockCode+'&apiToken=' + process.env.REACT_APP_FUGLE_API_KEY + '&from=' + searchData.current.startDate +'&to=' + searchData.current.endDate)
  .then((response) => response.json()) //2
  .then((stockDataList) => {
    stockDataList.candles.reverse() //3
    setStockData(stockDataList)
  })
  .catch(() => {
    firstRender.current = true
    isFetch.current = false
    alert("查詢條件錯誤")
  });
  await getNote(db, searchData, setNoteData)
  await getStockinformation(setStockInformation, searchData.current.stockCode)
}

async function getStockinformation(setStockInformation, stockCode) {
  const res = await fetch('https://api.fugle.tw/realtime/v0.3/intraday/meta?symbolId=' + stockCode + '&apiToken=' + process.env.REACT_APP_FUGLE_API_KEY)
  .then((response) => response.json()) //2
  .then((qStockInformation) => {
    setStockInformation(qStockInformation)
  })
}

async function getNote(db, searchData, setNoteData){
  await db.ref('/note/' + searchData.current.stockCode ).on('value', (snapshot) => { 
    let noteObj = {test:'test'}
    let startDate = new Date(searchData.current.startDate)
    let endDate = new Date(searchData.current.endDate)
    if(snapshot.exists()){
      while(startDate <= endDate){
        if(snapshot.val().hasOwnProperty(startDate.toISOString().slice(0, 10))){
          noteObj[startDate.toISOString().slice(0, 10)] = snapshot.val()[startDate.toISOString().slice(0, 10)]  
        }else{
          noteObj[startDate.toISOString().slice(0, 10)] = ''
        }
        startDate = new Date(startDate.getTime() + 24*60*60*1000)
      }
      setNoteData(noteObj)
    }
    else{
      while(startDate <= endDate){
        noteObj[startDate.toISOString().slice(0, 10)] = ''
        startDate = new Date(startDate.getTime() + 24*60*60*1000)
      }
      setNoteData(noteObj)
    }
  })
}

const Home = () => {
  const [stockData, setStockData] = useState([]);
  const [stockInformation, setStockInformation]= useState({});
  const user = useRef({});
  const firstRender = useRef(true)
  const isFetch = useRef(false)
  const [noteData, setNoteData] = useState({})
  const [lessThanColor, setLessThanColor] = useState('#000000')
  const [greaterOrEqualColor, setGreaterOrEqualColor] = useState('#0000ff')
  const firebaseDb = firebase.initializeApp(firebaseConfig)
  const database = firebaseDb.database()
  const searchData = useRef({startDate:'', endDate:'', stockCode:''})
  const auth = getAuth(firebaseDb)
  user.current = getAuth(firebaseDb).currentUser

  var today = new Date()
  while(today.getDay() == 7 || today.getDay() == 6){
    today = new Date(today.getTime() - 24*60*60*1000)
  }
  var startDay = new Date(today.getTime() - 24*60*60*1000*5)

  useEffect(() => {
    document.title = "rw-stockapp";  
  }, []);

  useEffect(() => {
    if(!firstRender){
      fetchData(setStockData,searchData, database, setNoteData, setStockInformation, firstRender, isFetch).then(()=>{
        isFetch.current = true
      })
    }
  }, [searchData])

  const handleNoteChange = (e) => {
    setNoteData(prev=>({...prev, [e.target.name]: e.target.value}))
  }

  const handleSearchChange = (e) => {
    searchData.current[e.target.name] = e.target.value
  }

  const quickSearchOnclick = async (e) =>{
    console.log(e.target.value)
    let today = new Date()
    searchData.current.endDate = new Date().toISOString().slice(0,10)
    today.setMonth(today.getMonth() - e.target.value)
    today.setDate(today.getDate() + 1);
    searchData.current.startDate = today.toISOString().slice(0,10);
    
    console.log(searchData.current)
  }

  const colorSelectSubmit = async (e) => {
    e.preventDefault();
    let type = e.target[0].value
    let color = e.target[1].value
    
    if(type == 'lessThan'){
      setLessThanColor(color)
    }
    else if(type == 'greaterOrEqual'){
      setGreaterOrEqualColor(color)
    }
  }
  
  const fireBaseSubmit = async (e) => {
    e.preventDefault();
    let date = e.target[0].value
    let note = e.target[1].value
    var updateData = {}
    updateData[date] = note
    await database.ref('/note/' + stockData.symbolId ).update(updateData).then(() => {
      alert("儲存成功")
    })
    .catch(() => {
      alert("儲存失敗")
    });
  }

  const handleSearchSubmit = event => {
    event.preventDefault();
    firstRender.current = false
    isFetch.current = false
    let button = event.target[3].value
    console.log(button)
    fetchData(setStockData,searchData, database, setNoteData, setStockInformation, firstRender, isFetch).then(()=>{
      isFetch.current = true
    })
  }

  const loginSubmit = event =>{
    event.preventDefault();
    let email = event.target[0].value
    let password = event.target[1].value
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("登入成功")
      user.current = userCredential.user
      firstRender.current = true
      setStockData({})
      //searchData.current = {startDate:'2022-10-01', endDate:'2022-10-03', stockCode:'2330'}
      //fetchData(setStockData,searchData, database, setNoteData)
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage)
    });
  }
  if(user.current == null){
    return(
      <div class="col-md-8 col-lg-7 mx-auto px-2">
        <div className="row justify-content-center">
          <h1 className="col-auto">rw - stockapp</h1>
        </div>
        <div className="card">
          <div class="card-body">
            <form onSubmit={loginSubmit}>
              <div class="form-row form-group">
                <label className="col-3 col-form-label">Email:</label>
                <div class="col">
                  <input type="email" className="form-control" name="email"></input>
                </div>
              </div>

              <div class="form-row form-group">
                <label type="password" className="col-3 col-form-label">密碼:</label>
                <div class="col">
                  <input type="password" className="form-control" name="password"/>
                </div>
              </div>

              <div className="row justify-content-center">
                  <button type="submit" className="btn btn-primary col-auto my-2">登入</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
  
  if(firstRender.current == true){
    return(
      <div className="px-2">
        <div className="row justify-content-center">
            <h1 className="col-auto ">請輸入查詢資料</h1>
        </div>

        <div className="card">
            <form onSubmit={handleSearchSubmit} className="col-auto m-2">
              <div className="form-row form-group">
                <label className="col-3 col-md-2 col-form-label ">股票代碼: </label>
                <div className="">
                  <input name="stockCode" className="form-control w-auto" onChange={handleSearchChange}></input>
                </div>
              </div>

              <div className="col">
                <button value="1" type="submit" className="btn btn-primary my-2" onClick={quickSearchOnclick}>一個月前至最近交易日</button>
                <button value="3" type="submit" className="btn btn-primary m-2" onClick={quickSearchOnclick}>三個月前至最近交易日</button>
                <button value="6" type="submit" className="btn btn-primary m-2" onClick={quickSearchOnclick}>六個月前至最近交易日</button>
                <button value="12" type="submit" className="btn btn-primary m-2" onClick={quickSearchOnclick}>一年前至最近交易日</button>
              </div>
              <div className="my-4">
                <div className="form-row form-group">
                  <label className="col-3 col-md-2 col-form-label">開始時間: </label>
                    <input name="startDate" className="form-control w-auto" type="date" onChange={handleSearchChange}></input>
                </div>
                <div className="form-row form-group">
                  <label className="col-3 col-md-2 col-form-label ">結束時間: </label>
                  <input name="endDate" className="form-control w-auto" type="date" onChange={handleSearchChange}></input>
                </div>
                <button type="submit" className="btn btn-primary my-2">區間查詢股票代碼</button>
              </div>
            </form>
        </div>
      </div>
    ) 
  }
  if(stockData.length === 0 || !isFetch.current){
    return(<div>loading</div>)
  }
  var dataIndex = 0
  if(!firstRender.current){
    return (
      <div>
        <div className="px-2">
          <div className="row justify-content-center">
              <h1 className="col-auto ">{stockData.symbolId}{stockInformation?.data.meta.nameZhTw}</h1>
          </div>
  
          <div className="card">
            <div className="cardhead">

            </div>
            <form onSubmit={handleSearchSubmit} className="col-auto m-2">
              <div className="form-row form-group">
                <label className="col-3 col-md-2 col-form-label " defaultValue="Bob">股票代碼: </label>
                <div className="">
                  <input name="stockCode" className="form-control w-auto" onChange={handleSearchChange}></input>
                </div>
              </div>
              <div className="col">
                <button value="1" type="submit" className="btn btn-primary my-2" onClick={quickSearchOnclick}>一個月前至最近交易日</button>
                <button value="3" type="submit" className="btn btn-primary m-2" onClick={quickSearchOnclick}>三個月前至最近交易日</button>
                <button value="6" type="submit" className="btn btn-primary m-2" onClick={quickSearchOnclick}>六個月前至最近交易日</button>
                <button value="12" type="submit" className="btn btn-primary m-2" onClick={quickSearchOnclick}>一年前至最近交易日</button>
              </div>
              <div className="my-4">
                <div className="form-row form-group">
                  <label className="col-3 col-md-2 col-form-label">開始時間: </label>
                  <div className="">
                    <input name="startDate" className="form-control w-auto" type="date"  onChange={handleSearchChange}></input>
                  </div>
                </div>
                <div className="form-row form-group">
                  <label className="col-3 col-md-2 col-form-label ">結束時間: </label>
                  <input name="endDate" className="form-control w-auto" type="date" onChange={handleSearchChange}></input>
                </div>
                <button type="submit" className="btn btn-primary my-2">區間查詢股票代碼</button>
              </div>
            </form>
          </div>
          <div className="card my-2">
            <PriceChart stockData={stockData} stockInformation={stockInformation.data?.meta}/>
          </div>
          <div className="card my-2">
            <div className="row">
              <form onSubmit={colorSelectSubmit} className="text-nowrap form-inline">
                <div className="form-group col-auto">
                  <label className="form-label ">低於前日收盤顏色: </label>
                  <input type="text" value="lessThan" hidden></input>
                  <input className="form-control form-control-color" type="color"></input>
                  <button className="btn btn-primary">套用</button>
                </div>
              </form>
              <form onSubmit={colorSelectSubmit} className="text-nowrap form-inline">
                <div className="form-group col-auto">
                  <label className="form-label ">高於等於前日收盤顏色: </label>
                  <input type="text" value="greaterOrEqual" hidden></input>
                  <input className="form-control form-control-color" type="color"></input>
                  <button className="btn btn-primary">套用</button>
                </div>
              </form>
            </div>
          </div>           
        </div>
        <div className="col-12 p-2 table-responsive">
          <table className="table table-bordered table-sm table-hover">
              <thead>
              <tr>
                  <th className="text-nowrap">日期</th>
                  <th className="text-nowrap">最高</th>
                  <th className="text-nowrap">最低</th>
                  <th className="text-nowrap">收盤</th>
                  <th className="text-nowrap">備註</th>
              </tr>
              </thead>
              <tbody>
              {stockData.candles?.map((item) => {
                  //const {id, name, address} = item;
                  if(dataIndex == 0){
                    dataIndex +=1 
                    var date = new Date(item.date)
                    return (
                      <tr key={item.date}>
                          <td className="text-nowrap" style={{color: date.getDay() == 5 ? 'red':'green'}}>{item.date.slice(5,10)}</td>
                          <td>{item.high}</td>
                          <td>{item.low}</td>
                          <td>{item.close}</td>
                          <td>
                              <form onSubmit={fireBaseSubmit} className="text-nowrap form-inline">
                                  <input type="hidden" name="date" value={item.date}></input>
                                  <div className="input-group">
                                    <input onChange={handleNoteChange} type="text" name={item.date} className="w-auto form-control" value={noteData[item.date]}></input>
                                    <span class="input-group-btn  px-2">
                                      <button type="submit" className="btn btn-primary">儲存筆記</button>
                                    </span>
                                  </div>
                              </form>
                          </td>
                      </tr>
                    );
                  }
                  var date = new Date(item.date)
                  dataIndex +=1 
                  return (
                      <tr key={item.date}>
                          <td style={{color: date.getDay() == 5 ? 'red':'green'}}>{item.date.slice(5,10)}</td>
                          <td style={{color: item.high >= stockData.candles[dataIndex-2].close ? greaterOrEqualColor:lessThanColor}}>{item.high}</td>
                          <td style={{color: item.low >= stockData.candles[dataIndex-2].close ? greaterOrEqualColor:lessThanColor}}>{item.low}</td>
                          <td style={{color: item.close >= stockData.candles[dataIndex-2].close ? greaterOrEqualColor:lessThanColor }}>{item.close}</td>
                          <td>
                              <form onSubmit={fireBaseSubmit} className="text-nowrap form-inline">
                                  <input type="hidden" name="date" value={item.date}></input>
                                  <div className="input-group">
                                    <input onChange={handleNoteChange} type="text" name={item.date} className="w-auto form-control" value={noteData[item.date]}></input>
                                    <span class="input-group-btn px-2">
                                      <button type="submit" className="btn btn-primary">儲存筆記</button>
                                    </span>
                                  </div>
                              </form> 
                          </td>
                      </tr>
                  );
              })}
              </tbody>
          </table>
        </div>
      </div>
    );
  }
};


export default Home;