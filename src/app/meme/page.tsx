import SoonLabel from "../../components/SoonLabel/SoonLabel";

export default function Page() {
    return (
        <h1 style={{
            display: 'flex',
            alignItems: "center",
            gap: 12,
            margin: 0,
            justifyContent: 'center'
        }}>
            Meme <SoonLabel />
        </h1>
    )
}