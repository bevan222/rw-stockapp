import firebase from 'firebase/compat/app';
import firebaseConfig from '../../src/component/firebaseConfig';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'

const FavoriteList = ({favoriteData, fetchFavorite, searchData, fetchData}) => {
    const [favoriteOpen, setFavoriteOpen] = useState(false);
    const firebaseDb = firebase.initializeApp(firebaseConfig)
    const database = firebaseDb.database()

    var tempFavoriteDataArray = []
    var favoriteDataArray = []
    for (const [key, value] of Object.entries(favoriteData)) {
        tempFavoriteDataArray.push({'code': key, 'name': value})
    }

    for(let i = 0 ; i < parseInt(tempFavoriteDataArray.length/2 + (tempFavoriteDataArray.length%2 == 0 ? 0 : 1)) ; i++){
        favoriteDataArray.push([tempFavoriteDataArray[i*2],tempFavoriteDataArray[i*2+1]])
    }

    const favoriteDeleteSubmit = async (e) => {
        e.preventDefault();
        let deleteCode = e.target[0].value
        await database.ref('/favorite').child(deleteCode).remove().then(() => {
          alert("刪除成功")
          fetchFavorite()
        })
        .catch(() => {
          alert("刪除失敗")
        });
    }

    const favoriteSearchSubmit = async (e) => {
        e.preventDefault();
        let today = new Date()
        searchData.current.stockCode = e.target[0].value
        searchData.current.endDate = new Date().toISOString().slice(0,10)
        today.setMonth(today.getMonth() - 3)
        today.setDate(today.getDate() + 1);
        searchData.current.startDate = today.toISOString().slice(0,10);
        console.log(searchData)
        fetchData()
        alert('搜尋成功')
    }

    return(
    <div className="card my-2">
        <div className='d-flex justify-content-center'>
            <Button
                className="btn btn-secondary m-2"
                onClick={() => setFavoriteOpen(!favoriteOpen)}
                aria-controls="collapse-favorite-table"
                aria-expanded={favoriteOpen}
            >
                我的選股
            {favoriteOpen ? <FontAwesomeIcon icon={faCaretUp} className="px-2"/> : <FontAwesomeIcon icon={faCaretDown} className="px-2"/>}
            </Button>
        </div>
        <Collapse in={favoriteOpen}>
            <div id="collapse-favorite-table">
                <div name="top" className="col-12 col-md-6 mx-auto p-2 table-responsive">
                    <table className="table table-bordered table-sm table-hover">
                        <tbody>
                            {favoriteDataArray?.map((item) => {
                                return (
                                    <tr>
                                        <td>
                                            {item[0] != undefined ? 
                                            <div style={{display:'flex'}}>
                                                <form onSubmit={favoriteSearchSubmit} className="text-nowrap py-1">
                                                    <input type="hidden" name="goFavoriteCode" value={item[0]?.code}></input>
                                                    <button type="submit" className="btn btn-light link-secondary">{item[0]?.code} - {item[0]?.name}</button>
                                                </form>
                                                <form onSubmit={favoriteDeleteSubmit} className="text-nowrap py-1">
                                                    <input type="hidden" name="deleteFavoriteCode" value={item[0]?.code}></input>
                                                    <button type="submit" className="btn btn-danger btn-sm">刪除</button>
                                                </form> 
                                            </div> : <div></div>
                                            }
                                        </td>
                                        <td>
                                            {item[1] != undefined ? 
                                            <div style={{display:'flex'}}>
                                                <form onSubmit={favoriteSearchSubmit} className="text-nowrap py-1">
                                                    <input type="hidden" name="goFavoriteCode" value={item[1]?.code}></input>
                                                    <button type="submit" className="btn btn-light link-secondary">{item[1]?.code} - {item[1]?.name}</button>
                                                </form>
                                                <form onSubmit={favoriteDeleteSubmit} className="text-nowrap py-1">
                                                    <input type="hidden" name="deleteFavoriteCode" value={item[1]?.code}></input>
                                                    <button type="submit" className="btn btn-danger btn-sm">刪除</button>
                                                </form> 
                                            </div> : <div></div>
                                            }
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </Collapse>
        <div className="d-flex justify-content-end bd-highlight mb-3">
            <a href="#top" className="mx-3 text-nowrap">移至最上方</a>
        </div>
        <div className="d-flex justify-content-end bd-highlight mb-3">
            <a href="#buttom" className="mx-3 text-nowrap">移至最下方</a>
        </div>
    </div>
    )
}

export default FavoriteList