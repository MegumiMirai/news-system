import NewsPublished from "../../../components/NewsPublished";
import usePublish from '../../../components/NewsPublished/usePublish'

export default function Sunset(){

  const {dataSource, getData} = usePublish(3)

  return (
      <div>
        <NewsPublished dataSource={dataSource} getData={getData}></NewsPublished>
      </div>
  )
}