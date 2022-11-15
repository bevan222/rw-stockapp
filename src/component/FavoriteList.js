import firebase from 'firebase/compat/app';
import firebaseConfig from '../../src/component/firebaseConfig';

const FavoriteList = ({favoriteData, fetchFavorite, searchData, fetchData}) => {
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
    <div className="card my-1">
        <div name="top" className="col-12 p-2 table-responsive">
            <table className="table table-bordered table-sm table-hover">
                <thead>
                    <tr>
                        <th colSpan={5} className="text-center">
                            我的選股
                            <a href="#favoriteButtom" className="mx-3 text-nowrap">移至最下方</a>
                        </th>
                    </tr>                
                    <tr>
                        <th className="text-nowrap">股票代碼</th>
                        <th className="text-nowrap">名稱</th>
                        <th className="text-nowrap">功能</th>
                    </tr>
                </thead>
                <tbody>
                    {favoriteDataArray?.map((item) => {
                        return (
                            <tr key={item.code}>
                                <td>{item.code}</td>
                                <td>{item.name}</td>
                                <td className="w-1">
                                    <form onSubmit={favoriteSearchSubmit} className="text-nowrap form-inline">
                                        <input type="hidden" name="goFavoriteCode" value={item.code}></input>
                                        <button className="btn btn-primary mx-1">前往</button>
                                    </form>
                                    <form onSubmit={favoriteDeleteSubmit} className="text-nowrap form-inline">
                                        <input type="hidden" name="deleteFavoriteCode" value={item.code}></input>
                                        <button type="submit" className="btn btn-danger mx-1">刪除</button>
                                    </form> 
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
    )
}

export default FavoriteList