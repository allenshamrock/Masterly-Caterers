import {useSelector} from 'react-redux'
import { selectUserData } from './Authslice'
const useAuth = (allowedRoles) => {
const user = useSelector(selectUserData)
if(!user) return false

const {role} = user
return allowedRoles.includes(role)
}

export default useAuth