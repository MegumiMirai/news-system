import NewsPublished from "../../../components/NewsPublished";
import usePublish from '../../../components/NewsPublished/usePublish'

export default function Unpublished(){

  const {dataSource, getData} = usePublish(1)

  return (
      <div>
        <NewsPublished dataSource={dataSource} getData={getData}></NewsPublished>
      </div>
  )
}