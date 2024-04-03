import React, { SVGProps } from 'react'

export const LinkSvg = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M7.16659 3.33301H2.99992C2.55789 3.33301 2.13397 3.5086 1.82141 3.82116C1.50885 4.13372 1.33325 4.55765 1.33325 4.99967V12.4997C1.33325 12.9417 1.50885 13.3656 1.82141 13.6782C2.13397 13.9907 2.55789 14.1663 2.99992 14.1663H10.4999C10.9419 14.1663 11.3659 13.9907 11.6784 13.6782C11.991 13.3656 12.1666 12.9417 12.1666 12.4997V8.33301M6.33325 9.16634L14.6666 0.833008M14.6666 0.833008H10.4999M14.6666 0.833008V4.99967" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
