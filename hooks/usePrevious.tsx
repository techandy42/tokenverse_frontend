import { useRef, useEffect } from 'react'

function usePrevious(value: any) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value //assign the value of ref to the argument
  }, [value]) //this code will run when the value of 'value' changes
  return ref.current //in the end, return the current ref value.
}
export default usePrevious

/* Usage Example starts */
/*
function Counter() {
  const [count, setCount] = useState(0);
  // 👇 look here
  const prevCount = usePrevious(count)

  return <h1> Now: {count}, before: {prevCount} </h1>;
}
*/
/* 
Output:
Now: 2, before: 1
*/
/* Usage Example ends */
