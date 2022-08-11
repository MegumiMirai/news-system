import NewsPublished from "../../../components/NewsPublished";
import usePublish from '../../../components/NewsPublished/usePublish'

export default function Published(){

  const {dataSource, getData} = usePublish(2)

  return (
      <div>
        <NewsPublished dataSource={dataSource} getData={getData}></NewsPublished>
      </div>
  )
}