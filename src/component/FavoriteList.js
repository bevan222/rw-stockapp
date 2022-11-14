const favoriteList = ({favoriteData}) => {
    console.log(favoriteData)
    return(
    <div>
        <div name="top" className="col-12 p-2 table-responsive">
            <table className="table table-bordered table-sm table-hover">
                <thead>
                    <tr>
                        <th colSpan={5} className="text-center">
                            我的選股
                        </th>
                    </tr>                
                    <tr>
                        <th className="text-nowrap">股票代碼</th>
                        <th className="text-nowrap">名稱</th>
                        <th className="text-nowrap">功能</th>
                    </tr>
                </thead>
                <tbody>
                    {favoriteData?.map((item) => {
                        return (
                            <tr key={item.code}>
                                <td>{item.code}</td>
                                <td>{item.name}</td>
                                <td className="w-1">
                                    <button className="btn btn-primary mx-1">前往</button>
                                    <button className="btn btn-danger mx-1">刪除</button>
                                </td>
                            </tr>
                        );
                    })}
                    <td className="text-center" colSpan={5}>
                        <a name="buttom" href="#top" className="font-weight-bold">移至最上方</a>
                    </td>
                </tbody>
            </table>
        </div>
    </div>
    )
}

export default favoriteList