import { useDispatch, useSelector } from 'react-redux';
import {
  decrement,
  increment,
  incrementByAmount,
} from '../features/counter/counterSlice';

function CounterCard() {
  const dispatch = useDispatch();
  const count = useSelector((state) => state.counter.value);

  return (
    <section className="card">
      <h2>Redux Counter</h2>
      <p className="count">{count}</p>
      <div className="actions">
        <button onClick={() => dispatch(decrement())}>-1</button>
        <button onClick={() => dispatch(increment())}>+1</button>
        <button onClick={() => dispatch(incrementByAmount(5))}>+5</button>
      </div>
    </section>
  );
}

export default CounterCard;
