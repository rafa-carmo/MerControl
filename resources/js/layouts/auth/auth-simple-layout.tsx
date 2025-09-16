import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { Link, usePage } from '@inertiajs/react';
import { SVGProps, type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    const { name } = usePage().props;

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10 ">
            <div className="w-full grid lg:grid-cols-2 md:gap-5 px-3 md:px-5 place-items-center">
                <div className="flex flex-col gap-8 bg-primary-foreground pb-10 pt-4 px-10 rounded-lg md:w-lg lg:w-3/4">
                    <div className="flex flex-col items-center gap-4">
                        <Link href={home()} className="flex items-center justify-start gap-5 font-medium w-full">
                            <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-md">
                                <AppLogoIcon className="size-9 fill-current text-[var(--foreground)] dark:text-white" />
                            </div>
                            <span>{name}</span>
                        </Link>

                        <div className="space-y-2 text-center">

                            <h1 className="text-xl font-medium">{title}</h1>
                            <p className="text-center text-sm text-muted-foreground">{description}</p>
                        </div>
                    </div>
                    {children}
                </div>

                <div className='w-2/4 lg:w-full max-h-screen items-center justify-center lg:flex hidden  overflow-hidden'>
                    <div className="flex flex-col items-center justify-center">
                        <div className="w-full text-primary">
                            <Icon />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}


const Icon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={700.131}
        height={580.953}
        {...props}
    >
        <g data-name="Group 250" transform="translate(-588.934 -261.267)">
            <path
                fill="#e6e6e6"
                d="M1262.658 614.88c0-5.36-1.8-9.71-4.01-9.72h-602.49c-2.22.01-4.01 4.36-4.02 9.72v220.643a2 2 0 0 1-1.809 1.994q-2.425.233-4.851.433c-.04 0-.08.01-.12.01-.88.08-1.76.14-2.64.21h-.01q-.679-1.255-1.342-2.533a2.011 2.011 0 0 1-.228-.929V602.27c0-1.48.06-2.97.16-4.44a56.881 56.881 0 0 1 .75-6.02c1.69-9.29 5.51-15.58 9.85-15.6h611a4.682 4.682 0 0 1 1.84.39 7.174 7.174 0 0 1 2.27 1.59 14.068 14.068 0 0 1 2.23 3.05c2.14 3.77 3.67 9.39 4.21 15.93 0 .06.01.12.01.18.14 1.62.21 3.27.2 4.92l.14 21.43.09 12.78.27 40.1.1 14.24.44 146.2a2 2 0 0 1-2 2h-8.04a2 2 0 0 1-2-2Z"
                data-name="Path 4007"
            />
            <path
                fill="#2f2e41"
                d="M1098.942 475.934h-64.919a3.464 3.464 0 0 0-3.459 3.467v102.554h71.846V479.4a3.466 3.466 0 0 0-3.468-3.467ZM1066.7 534.2a7.7 7.7 0 0 1-7.666-7.666V514.71a7.666 7.666 0 1 1 15.332 0v11.829a7.7 7.7 0 0 1-7.666 7.661Z"
                data-name="Path 4018"
            />
            <path
                fill="#3f3d56"
                d="M1030.341 578.675v9.894a1.938 1.938 0 0 0 1.934 1.934h68.425a1.944 1.944 0 0 0 1.934-1.934v-9.894Z"
                data-name="Path 4019"
            />
            <path
                fill="#3f3d56"
                d="M1206.443 315.888h-277.5a9.008 9.008 0 0 0-8.994 8.994v187.262a9 9 0 0 0 8.994 8.994h277.5a9 9 0 0 0 8.994-8.994V324.882a9.008 9.008 0 0 0-8.994-8.994Z"
                data-name="Path 4020"
            />
            <path
                fill="#fff"
                d="M1204.126 322.384h-272.87a4.821 4.821 0 0 0-4.81 4.82v182.62a4.818 4.818 0 0 0 4.81 4.81h272.87a4.818 4.818 0 0 0 4.81-4.81V327.2a4.82 4.82 0 0 0-4.81-4.82Z"
                data-name="Path 4021"
            />
            <path
                fill="#2f2e41"
                d="M1150.976 593.947H988.633a2.986 2.986 0 0 1-2.922-3.6l2.519-11.964a3 3 0 0 1 2.922-2.371h157.305a3 3 0 0 1 2.922 2.371l2.519 11.964a2.986 2.986 0 0 1-2.922 3.6Z"
                data-name="Path 4022"
            />
            <rect
                width={5}
                height={3}
                fill="#3f3d56"
                data-name="Rectangle 846"
                rx={0.488}
                transform="translate(992.305 578.165)"
            />
            <rect
                width={5}
                height={3}
                fill="#3f3d56"
                data-name="Rectangle 847"
                rx={0.488}
                transform="translate(1002.305 578.165)"
            />
            <rect
                width={5}
                height={3}
                fill="#3f3d56"
                data-name="Rectangle 848"
                rx={0.488}
                transform="translate(1012.305 578.165)"
            />
            <rect
                width={5}
                height={3}
                fill="#3f3d56"
                data-name="Rectangle 849"
                rx={0.488}
                transform="translate(1022.305 578.165)"
            />
            <rect
                width={5}
                height={3}
                fill="#3f3d56"
                data-name="Rectangle 850"
                rx={0.488}
                transform="translate(1032.305 578.165)"
            />
            <rect
                width={5}
                height={3}
                fill="#3f3d56"
                data-name="Rectangle 851"
                rx={0.488}
                transform="translate(1042.305 578.165)"
            />
            <rect
                width={5}
                height={3}
                fill="#3f3d56"
                data-name="Rectangle 852"
                rx={0.488}
                transform="translate(1052.305 578.165)"
            />
            <rect
                width={5}
                height={3}
                fill="#3f3d56"
                data-name="Rectangle 853"
                rx={0.488}
                transform="translate(1062.305 578.165)"
            />
            <rect
                width={5}
                height={3}
                fill="#3f3d56"
                data-name="Rectangle 854"
                rx={0.488}
                transform="translate(1072.305 578.165)"
            />
            <rect
                width={5}
                height={3}
                fill="#3f3d56"
                data-name="Rectangle 855"
                rx={0.488}
                transform="translate(1082.305 578.165)"
            />
            <rect
                width={5}
                height={3}
                fill="#3f3d56"
                data-name="Rectangle 856"
                rx={0.488}
                transform="translate(1092.305 578.165)"
            />
            <rect
                width={5}
                height={3}
                fill="#3f3d56"
                data-name="Rectangle 857"
                rx={0.488}
                transform="translate(1102.305 578.165)"
            />
            <rect
                width={5}
                height={3}
                fill="#3f3d56"
                data-name="Rectangle 858"
                rx={0.488}
                transform="translate(1112.305 578.165)"
            />
            <rect
                width={5}
                height={3}
                fill="#3f3d56"
                data-name="Rectangle 859"
                rx={0.488}
                transform="translate(1122.305 578.165)"
            />
            <rect
                width={5}
                height={3}
                fill="#3f3d56"
                data-name="Rectangle 860"
                rx={0.488}
                transform="translate(1132.305 578.165)"
            />
            <rect
                width={5}
                height={3}
                fill="#3f3d56"
                data-name="Rectangle 861"
                rx={0.488}
                transform="translate(1142.305 578.165)"
            />
            <rect
                width={5}
                height={3}
                fill="#3f3d56"
                data-name="Rectangle 862"
                rx={0.488}
                transform="translate(992.187 583.165)"
            />
            <rect
                width={5}
                height={3}
                fill="#3f3d56"
                data-name="Rectangle 863"
                rx={0.488}
                transform="translate(1002.187 583.165)"
            />
            <rect
                width={5}
                height={3}
                fill="#3f3d56"
                data-name="Rectangle 864"
                rx={0.488}
                transform="translate(1012.187 583.165)"
            />
            <rect
                width={5}
                height={3}
                fill="#3f3d56"
                data-name="Rectangle 865"
                rx={0.488}
                transform="translate(1022.187 583.165)"
            />
            <rect
                width={5}
                height={3}
                fill="#3f3d56"
                data-name="Rectangle 866"
                rx={0.488}
                transform="translate(1032.187 583.165)"
            />
            <rect
                width={5}
                height={3}
                fill="#3f3d56"
                data-name="Rectangle 867"
                rx={0.488}
                transform="translate(1042.187 583.165)"
            />
            <rect
                width={5}
                height={3}
                fill="#3f3d56"
                data-name="Rectangle 868"
                rx={0.488}
                transform="translate(1052.187 583.165)"
            />
            <rect
                width={5}
                height={3}
                fill="#3f3d56"
                data-name="Rectangle 869"
                rx={0.488}
                transform="translate(1062.187 583.165)"
            />
            <rect
                width={5}
                height={3}
                fill="#3f3d56"
                data-name="Rectangle 870"
                rx={0.488}
                transform="translate(1072.187 583.165)"
            />
            <rect
                width={5}
                height={3}
                fill="#3f3d56"
                data-name="Rectangle 871"
                rx={0.488}
                transform="translate(1082.187 583.165)"
            />
            <rect
                width={5}
                height={3}
                fill="#3f3d56"
                data-name="Rectangle 872"
                rx={0.488}
                transform="translate(1092.187 583.165)"
            />
            <rect
                width={5}
                height={3}
                fill="#3f3d56"
                data-name="Rectangle 873"
                rx={0.488}
                transform="translate(1102.187 583.165)"
            />
            <rect
                width={5}
                height={3}
                fill="#3f3d56"
                data-name="Rectangle 874"
                rx={0.488}
                transform="translate(1112.187 583.165)"
            />
            <rect
                width={5}
                height={3}
                fill="#3f3d56"
                data-name="Rectangle 875"
                rx={0.488}
                transform="translate(1122.187 583.165)"
            />
            <rect
                width={5}
                height={3}
                fill="#3f3d56"
                data-name="Rectangle 876"
                rx={0.488}
                transform="translate(1132.187 583.165)"
            />
            <rect
                width={5}
                height={3}
                fill="#3f3d56"
                data-name="Rectangle 877"
                rx={0.488}
                transform="translate(1142.187 583.165)"
            />
            <rect
                width={40}
                height={3}
                fill="#3f3d56"
                data-name="Rectangle 878"
                rx={0.488}
                transform="translate(1040.187 589.165)"
            />
            <path
                fill="#f0f0f0"
                d="m1185.334 822.182-7.71-12.39-1.54 7.08c-.27 1.24-.54 2.5-.79 3.75-2.19-1.87-4.52-3.6-6.8-5.26q-10.5-7.62-20.99-15.26l2.19 12.7c1.35 7.82 2.76 15.8 6.1 22.95.37.81.77 1.61 1.2 2.39h32.54a10.5 10.5 0 0 0 .54-2.24.767.767 0 0 0 .01-.15c.51-4.852-2.17-9.42-4.75-13.57Z"
                data-name="Path 4023"
            />
            <path
                fill="#f0f0f0"
                d="m779.334 822.182-7.71-12.39-1.54 7.08c-.27 1.24-.54 2.5-.79 3.75-2.19-1.87-4.52-3.6-6.8-5.26q-10.5-7.62-20.99-15.26l2.19 12.7c1.35 7.82 2.76 15.8 6.1 22.95.37.81.77 1.61 1.2 2.39h32.54a10.488 10.488 0 0 0 .54-2.24.774.774 0 0 0 .01-.15c.51-4.852-2.17-9.42-4.75-13.57Z"
                data-name="Path 4024"
            />
            <path
                fill="#cacaca"
                d="m1363.875 839.5-275.75.307a1.191 1.191 0 0 1 0-2.381l275.75-.307a1.191 1.191 0 0 1 0 2.381Z"
                data-name="Path 4025"
            />
            <path
                fill="#cacaca"
                d="M1190.41 347.545H935.086a1.016 1.016 0 0 1 0-2.031h255.324a1.016 1.016 0 0 1 0 2.031Z"
                data-name="Path 4026"
            />
            <ellipse
                cx={5.95}
                cy={6.083}
                fill="#3f3d56"
                data-name="Ellipse 687"
                rx={5.95}
                ry={6.083}
                transform="translate(946.517 328.165)"
            />
            <ellipse
                cx={5.95}
                cy={6.083}
                fill="#3f3d56"
                data-name="Ellipse 688"
                rx={5.95}
                ry={6.083}
                transform="translate(967.072 328.165)"
            />
            <ellipse
                cx={5.95}
                cy={6.083}
                fill="#3f3d56"
                data-name="Ellipse 689"
                rx={5.95}
                ry={6.083}
                transform="translate(987.628 328.165)"
            />
            <path
                fill="#3f3d56"
                d="M1178.033 329.672h-14.6a1.106 1.106 0 1 0 0 2.211h14.6a1.106 1.106 0 1 0 0-2.211Z"
                data-name="Path 4027"
            />
            <path
                fill="#3f3d56"
                d="M1178.033 333.822h-14.6a1.106 1.106 0 1 0 0 2.211h14.6a1.106 1.106 0 1 0 0-2.211Z"
                data-name="Path 4028"
            />
            <path
                fill="#3f3d56"
                d="M1178.033 337.967h-14.6a1.106 1.106 0 1 0 0 2.211h14.6a1.106 1.106 0 1 0 0-2.211Z"
                data-name="Path 4029"
            />
            <rect
                width={40.582}
                height={8.678}
                fill="currentcolor"
                data-name="Rectangle 879"
                rx={4.339}
                transform="translate(1047.12 402.863)"
            />
            <rect
                width={81.802}
                height={8.678}
                fill="#e6e6e6"
                data-name="Rectangle 880"
                rx={4.339}
                transform="translate(1026.51 420.22)"
            />
            <rect
                width={81.802}
                height={8.678}
                fill="#e6e6e6"
                data-name="Rectangle 881"
                rx={4.339}
                transform="translate(1026.51 437.575)"
            />
            <path
                fill="#e6e6e6"
                d="M961.186 504.164a29.815 29.815 0 0 1-1.88 10.47h-28.05a4.818 4.818 0 0 1-4.81-4.81v-35.28a29.634 29.634 0 0 1 4.74-.38 30 30 0 0 1 30 30Z"
                data-name="Path 4030"
            />
            <path
                fill="#cacaca"
                d="m865.875 839.5-275.75.307a1.191 1.191 0 0 1 0-2.381l275.75-.307a1.191 1.191 0 1 1 0 2.381Z"
                data-name="Path 4041"
            />
            <g data-name="Group 65" transform="translate(-17627.836 -2386.115)">
                <path
                    fill="#ffb9b9"
                    d="M18365.011 2683.345s27.078-19.462 30.463-10.154-20.309 26.235-20.309 26.235Z"
                    data-name="Path 1025"
                />
                <path
                    fill="#2f2e41"
                    d="M18461.052 2708.307c0 33.648-14.487 34.693-38.087 34.693s-47.377-1.045-47.377-34.693 19.132-60.925 42.732-60.925 42.732 27.277 42.732 60.925Z"
                    data-name="Path 1026"
                />
                <path
                    fill="#ffb9b9"
                    d="M18403.089 2707.884s3.385 25.385-12.693 27.078 52.463 6.769 52.463 6.769-17.77-16.077-8.462-28.77-31.308-5.077-31.308-5.077Z"
                    data-name="Path 1027"
                />
                <path
                    d="M18403.089 2707.884s3.385 25.385-12.693 27.078 52.463 6.769 52.463 6.769-17.77-16.077-8.462-28.77-31.308-5.077-31.308-5.077Z"
                    data-name="Path 1028"
                    opacity={0.1}
                />
                <path
                    fill="#090814"
                    d="m18317.624 3161.437-5.923 49.925s-29.616 36.386-11 33.847 30.462-5.077 30.462-8.462 2.539-16.924 5.077-16.924 2.539 9.308 2.539 9.308a78.288 78.288 0 0 0 8.462-4.231c.846-.846 1.692-29.616 1.692-29.616s2.539-14.385-2.539-21.154-4.231-12.693-4.231-12.693Z"
                    data-name="Path 1029"
                />
                <path
                    fill="#090814"
                    d="M18453.863 3158.052s-2.539 49.924-5.923 52.463-12.693 38.924 4.231 33.847 24.539-10.154 24.539-13.539 0-27.078 1.692-32.155 0-14.385-.846-15.231-2.539-24.539-2.539-24.539Z"
                    data-name="Path 1030"
                />
                <path
                    fill="#090814"
                    d="M18361.626 2864.427s-27.078 77-28.77 93.926 1.692 74.466 1.692 74.466-24.539 130.31-19.462 131.156 28.77 4.231 29.616 0 4.231-10.154 3.385-12.693 2.539-11.847 2.539-16.924 16.077-62.617 15.231-66.848 14.385-66.848 16.924-71.925 9.308-40.617 9.308-40.617 38.079 104.081 38.924 106.619 4.231 6.769 2.539 7.616 2.539 6.769 2.539 6.769 14.385 66 14.385 67.694-1.692 15.231 1.692 16.078 24.539 5.923 26.232 0-10.155-104.925-10.155-104.925-14.385-43.155-10.154-54.156-4.231-77-7.616-82.079-4.231-35.54-4.231-35.54Z"
                    data-name="Path 1031"
                />
                <circle
                    cx={27.078}
                    cy={27.078}
                    r={27.078}
                    fill="#ffb9b9"
                    data-name="Ellipse 178"
                    transform="translate(18390.82 2667.691)"
                />
                <path
                    fill="currentcolor"
                    d="M18403.088 2729.038s30.462.846 32.155-1.692 44 5.923 44 22.847-24.539 82.926-24.539 82.926-9.308 47.386-6.769 52.463-93.926-11-91.387-19.462 16.924-27.078-1.692-43.155-26.232-33-26.232-33l22-58.386s22-3.385 27.078 0 25.386-2.541 25.386-2.541Z"
                    data-name="Path 1032"
                />
                <path
                    fill="currentcolor"
                    d="m18334.548 2794.194-5.923-4.231s-55-57.54-40.617-68.541 35.54-21.154 45.694-22 18.616-8.462 18.616-8.462 11-19.462 19.462-6.769 17.77 16.924 5.923 21.155-19.462 2.538-25.385 6.769-28.77 11-18.616 13.539a90.82 90.82 0 0 1 16.923 5.923l11 19.462Z"
                    data-name="Path 1033"
                />
                <path
                    fill="#ffb9b9"
                    d="M18430.166 2937.199s-22 32.155-5.923 30.462 23.693-23.693 23.693-23.693Z"
                    data-name="Path 1034"
                />
                <path
                    fill="currentcolor"
                    d="m18473.324 2745.962 5.923 4.231s19.462 106.619 0 134.543-21.154 26.231-21.154 26.231-3.385-2.539-5.077 14.385.846 23.693-4.231 23.693-27.924-5.077-26.232-9.308 12.693-28.77 13.539-34.693 5.077-19.462 6.77-27.078-7.616-11.847-3.385-27.924 10.154-44.848 10.154-50.771 23.693-53.309 23.693-53.309Z"
                    data-name="Path 1035"
                />
                <path
                    fill="#090814"
                    d="M18444.129 2670.655c0 9.113-12.5 16.5-27.924 16.5s-29.614 4.88-29.614-4.233 14.194-28.77 29.616-28.77 27.922 7.387 27.922 16.503Z"
                    data-name="Path 1036"
                />
                <path
                    fill="#2f2e41"
                    d="M18375.841 2714.018s-1.14 30.675 29.343 28.983-4.119-26.221-4.119-26.221Z"
                    data-name="Path 1037"
                />
            </g>
            <g data-name="Group 243">
                <path
                    fill="#3f3d56"
                    d="M835.86 657.318h-75.327a7.623 7.623 0 0 1-7.615-7.615V580.78a7.623 7.623 0 0 1 7.615-7.615h75.33a7.623 7.623 0 0 1 7.615 7.615v68.923a7.623 7.623 0 0 1-7.618 7.615Z"
                    data-name="Path 4010"
                />
                <path
                    fill="#fff"
                    d="M830.565 650.972h-64.74a6.769 6.769 0 0 1-6.761-6.761v-57.938a6.769 6.769 0 0 1 6.761-6.761h64.74a6.769 6.769 0 0 1 6.761 6.761v57.938a6.769 6.769 0 0 1-6.761 6.761Z"
                    data-name="Path 4011"
                />
                <path
                    fill="currentcolor"
                    d="M824.107 596.38h-51.823a1.69 1.69 0 0 1 0-3.38h51.823a1.69 1.69 0 0 1 0 3.38Z"
                    data-name="Path 4012"
                />
                <path
                    fill="currentcolor"
                    d="M824.107 603.058h-51.823a1.69 1.69 0 1 1 0-3.38h51.823a1.69 1.69 0 0 1 0 3.38Z"
                    data-name="Path 4013"
                />
                <path
                    fill="currentcolor"
                    d="M794.748 609.736h-22.464a1.69 1.69 0 1 1 0-3.38h22.464a1.69 1.69 0 0 1 0 3.38Z"
                    data-name="Path 4014"
                />
                <path
                    fill="#e4e4e4"
                    d="M824.107 623.724h-51.823a1.69 1.69 0 0 1 0-3.38h51.823a1.69 1.69 0 0 1 0 3.38Z"
                    data-name="Path 4015"
                />
                <path
                    fill="#e4e4e4"
                    d="M824.107 630.402h-51.823a1.69 1.69 0 1 1 0-3.38h51.823a1.69 1.69 0 0 1 0 3.38Z"
                    data-name="Path 4016"
                />
                <path
                    fill="#e4e4e4"
                    d="M794.748 637.08h-22.464a1.69 1.69 0 1 1 0-3.38h22.464a1.69 1.69 0 0 1 0 3.38Z"
                    data-name="Path 4017"
                />
            </g>
        </g>
    </svg>
)
