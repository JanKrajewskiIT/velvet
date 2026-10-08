const Wheel = (props: { x: number }) => (
  <g transform={`translate(${props.x},19)`}>
    <circle class="b-tire" r="9" stroke-dasharray="56.549 56.549" />
    <g class="b-spkspin" stroke-dasharray="31.416 31.416" stroke-dashoffset="-23.562">
      <circle class="b-spk" r="5" />
      <circle class="b-spk" r="5" transform="rotate(180,0,0)" />
    </g>
  </g>
);

/** Geometry of the `bike` loader; the keyframes live in the loader stylesheet. */
export const LoaderBike = () => (
  <svg viewBox="0 0 48 30" width="48" height="30" aria-hidden="true">
    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1">
      <Wheel x={9.5} />
      <g transform="translate(24,19)">
        <g class="b-pedspin" stroke-dasharray="25.133 25.133" stroke-dashoffset="-21.991" transform="rotate(67.5,0,0)">
          <circle class="b-ped" r="4" />
          <circle class="b-ped" r="4" transform="rotate(180,0,0)" />
        </g>
      </g>
      <Wheel x={38.5} />
      <polyline class="b-seat" points="14 3,18 3" stroke-dasharray="5 5" />
      <polyline class="b-body" points="16 3,24 19,9.5 19,18 8,34 7,24 19" stroke-dasharray="79 79" />
      <path class="b-bars" d="m30,2h6s1,0,1,1-1,1-1,1" stroke-dasharray="10 10" />
      <polyline class="b-front" points="32.5 2,38.5 19" stroke-dasharray="19 19" />
    </g>
  </svg>
);
