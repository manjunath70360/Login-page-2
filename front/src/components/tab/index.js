
import "./index.css"


const TabRender = (props) =>{
    const {details, onChangeTab, isActive} = props
const {tabName, tabId} = details

const onClickTab = ()=>{
onChangeTab(tabId)

}

const activeClass = isActive === tabId ? 'active-tab' : 'inactive-tab';

return(
    <li className={`tab-item ${activeClass}`} onClick={onClickTab}>
           {tabName}
          </li>
)

}

export default TabRender