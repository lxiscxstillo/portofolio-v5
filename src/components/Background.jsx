import React from "react"

const AnimatedBackground = () => {
	return (
		<div className="fixed inset-0">
			<div className="absolute inset-0 bg-[#0A0A0A]"></div>
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]"></div>
		</div>
	)
}

export default AnimatedBackground
