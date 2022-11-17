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

    let favoriteDataArray = []
    for (const [key, value] of Object.entries(favoriteData)) {
        favoriteDataArray.push({'code': key, 'name': value})
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
                        <thead>
                            <tr>
                                <th colSpan={5} className="text-center">
                                    我的選股
                                </th>
                            </tr>                
                        </thead>
                        <tbody>
                            {favoriteDataArray?.map((item) => {
                                return (
                                    <tr key={item.code}>
                                        <td>
                                            <div style={{display:'flex'}}>
                                                <form onSubmit={favoriteSearchSubmit} className="text-nowrap py-1">
                                                    <input type="hidden" name="goFavoriteCode" value={item.code}></input>
                                                    <button type="submit" className="btn btn-light link-secondary">{item.code} - {item.name}</button>
                                                </form>
                                                <form onSubmit={favoriteDeleteSubmit} className="text-nowrap py-1">
                                                    <input type="hidden" name="deleteFavoriteCode" value={item.code}></input>
                                                    <button type="submit" className="btn btn-danger btn-sm">刪除</button>
                                                </form> 
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{display:'flex'}}>
                                                <form onSubmit={favoriteSearchSubmit} className="text-nowrap py-1">
                                                    <input type="hidden" name="goFavoriteCode" value={item.code}></input>
                                                    <button type="submit" className="btn btn-light link-secondary">{item.code} - {item.name}</button>
                                                </form>
                                                <form onSubmit={favoriteDeleteSubmit} className="text-nowrap py-1">
                                                    <input type="hidden" name="deleteFavoriteCode" value={item.code}></input>
                                                    <button type="submit" className="btn btn-danger btn-sm">刪除</button>
                                                </form> 
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            <tr>
                                <td className="text-center" colSpan={5}>
                                    <a name="favoriteButtom" href="#top" className="font-weight-bold">移至最上方</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </Collapse>
    </div>
    )
}

export default FavoriteList