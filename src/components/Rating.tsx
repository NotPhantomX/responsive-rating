import styles from './Rating.module.scss';
import star from '../assets/icon-star.svg';
import thankYouImg from '../assets/illustration-thank-you.svg';
import { createSignal, For, JSX, Show, splitProps } from 'solid-js';

function RatingButton(
  props: JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
    val: number;
    selected: boolean;
  },
) {
  const [local, others] = splitProps(props, ['val', 'selected']);
  return (
    <button
      {...others}
      classList={{
        [styles['rating-button']]: true,
        [styles['active']]: local.selected,
      }}
    >
      {local.val}
    </button>
  );
}

function RatingForm(props: {
  onSubmit: (event: SubmitEvent) => void;
  handleRatingClicked: (rating: number) => void;
  selectedRating?: number;
}) {
  return (
    <form onSubmit={props.onSubmit}>
      <div class={styles['panel']}>
        <img src={star} class={styles['star-icon']} />
        <h1 class={styles['title']}>How did we do?</h1>
        <p class={styles['description']}>
          Please let us know how we did with your support request. All feedback
          is appreciated to help us improve out offering!
        </p>

        <div class={styles['rating-row']}>
          <For each={[1, 2, 3, 4, 5]}>
            {(item) => (
              <RatingButton
                val={item}
                selected={props.selectedRating === item}
                onClick={() => props.handleRatingClicked(item)}
                type="button"
              />
            )}
          </For>
        </div>

        <button class={styles['submit-button']} type="submit">
          Submit
        </button>
      </div>
    </form>
  );
}

function RatingSubmitted(props: { selectedRating: number }) {
  return (
    <div class={styles['thank-you-panel']}>
      <img src={thankYouImg} />

      <p class={styles['selected-rating']}>
        You selected {props.selectedRating} out of 5
      </p>

      <h1 class={styles['title']}>Thank you!</h1>

      <p class={styles['description']}>
        We appreciate you taking the time to give a rating. If you ever need
        more support, don't hesitate to get in touch!
      </p>
    </div>
  );
}

export default function Rating() {
  const [selectedRating, setSelectedRating] = createSignal<number>();
  const [isSubmitted, setSubmitted] = createSignal(false);

  const handleRatingClicked = (rating: number) => setSelectedRating(rating);
  const handleSubmitted = (e: SubmitEvent) => {
    e.preventDefault();
    if (!selectedRating()) return;
    setSubmitted(true);
  };
  return (
    <Show
      when={!isSubmitted()}
      fallback={<RatingSubmitted selectedRating={selectedRating()!} />}
    >
      <RatingForm
        handleRatingClicked={handleRatingClicked}
        onSubmit={handleSubmitted}
        selectedRating={selectedRating()}
      />
    </Show>
  );
}
