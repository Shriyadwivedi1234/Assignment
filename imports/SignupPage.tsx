function Rectangle3() {
  return (
    <div className="relative size-full">
      <div className="absolute bg-[#d9d9d9] inset-0 rounded-[30px]" />
    </div>
  );
}

function Cta() {
  return (
    <div className="overflow-clip relative rounded-[30px] size-full" data-name="CTA">
      <div
        className="absolute box-border content-stretch flex flex-row gap-[14.683px] h-[44.05px] items-center justify-center left-[9px] overflow-clip px-[22.025px] py-[2.937px] rounded-lg top-[9px] w-[159.668px]"
        data-name="CTA"
      >
        <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[20.56px] text-center text-nowrap tracking-[-0.0021px]">
          <p className="adjustLetterSpacing block leading-[38.177px] whitespace-pre">Get Started</p>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none shadow-[0px_0px_20px_4px_inset_rgba(255,255,255,0.25)]" />
    </div>
  );
}

function SignUpPassword() {
  return (
    <div
      className="absolute bg-[rgba(244,244,255,0.73)] h-[53px] left-1/2 overflow-clip rounded-[30px] translate-x-[-50%] translate-y-[-50%] w-[449px]"
      data-name="Sign up Password"
      style={{ top: "calc(50% + 89.5px)" }}
    >
      <div className="absolute flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] left-[23px] not-italic opacity-[0.33] text-[#000000] text-[16px] text-left top-[27px] tracking-[-0.0016px] translate-y-[-50%] w-[222px]">
        <p className="adjustLetterSpacing block leading-[26px]">Enter your password</p>
      </div>
    </div>
  );
}

function SignUpEmail() {
  return (
    <div
      className="absolute bg-[rgba(244,244,255,0.73)] h-[53px] left-1/2 overflow-clip rounded-[30px] top-[278px] translate-x-[-50%] w-[449px]"
      data-name="Sign up Email"
    >
      <div className="absolute flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] left-[23px] not-italic opacity-[0.33] text-[#000000] text-[16px] text-left top-[27px] tracking-[-0.0016px] translate-y-[-50%] w-[222px]">
        <p className="adjustLetterSpacing block leading-[26px]">Enter your Email or username</p>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div
      className="absolute bg-[#ced4ff] h-[610px] rounded-[30px] translate-x-[-50%] translate-y-[-50%] w-[555px]"
      style={{ top: "calc(50% + 97px)", left: "calc(50% - 0.5px)" }}
    >
      <div className="h-[610px] overflow-clip relative w-[555px]">
        <div className="absolute h-10 left-[63px] top-32 w-[215px]">
          <Rectangle3 />
        </div>
        <div
          className="absolute bg-[#000000] bottom-[21.95px] h-[62.05px] overflow-clip rounded-[30px] translate-x-[-50%] w-[177.668px]"
          data-name="CTA"
          style={{ left: "calc(50% + 0.334px)" }}
        >
          <Cta />
        </div>
        <div
          className="absolute flex flex-col font-['Poppins:SemiBold',_sans-serif] justify-center leading-[0] not-italic text-[#000000] text-[32px] text-center text-nowrap top-[53.5px] tracking-[-0.0032px] translate-x-[-50%] translate-y-[-50%]"
          style={{ left: "calc(50% + 0.5px)" }}
        >
          <p className="adjustLetterSpacing block leading-[38.177px] whitespace-pre">Welcome back</p>
        </div>
        <div
          className="absolute bg-[rgba(255,252,235,0.38)] h-[52px] rounded-[30px] top-[122px] translate-x-[-50%] w-[450px]"
          style={{ left: "calc(50% + 0.5px)" }}
        />
        <button
          className="[white-space-collapse:collapse] absolute cursor-pointer flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic text-[#000000] text-[16px] text-left text-nowrap top-[148px] tracking-[-0.0016px] translate-y-[-50%]"
          style={{ left: "calc(50% - 135.5px)" }}
        >
          <p className="adjustLetterSpacing block leading-[26px] whitespace-pre">Sign up</p>
        </button>
        <div
          className="absolute flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic text-[#000000] text-[16px] text-left text-nowrap top-[148px] tracking-[-0.0016px] translate-y-[-50%]"
          style={{ left: "calc(50% + 76.5px)" }}
        >
          <p className="adjustLetterSpacing block leading-[26px] whitespace-pre">Register</p>
        </div>
        <div
          className="absolute flex flex-col font-['Poppins:ExtraLight',_sans-serif] justify-center leading-[0] not-italic text-[#000000] text-[14px] text-center text-nowrap top-[91.5px] tracking-[-0.0014px] translate-x-[-50%] translate-y-[-50%]"
          style={{ left: "calc(50% - 0.5px)" }}
        >
          <p className="leading-[38.177px] whitespace-pre">
            <span className="font-['Poppins:SemiBold',_sans-serif] not-italic">Sign in to your account</span>
            <span className="adjustLetterSpacing">{` or create a new company profile`}</span>
          </p>
        </div>
        <SignUpPassword />
        <SignUpEmail />
      </div>
      <div
        aria-hidden="true"
        className="absolute border border-[#000000] border-solid inset-0 pointer-events-none rounded-[30px] shadow-[0px_0px_38.6px_20px_rgba(181,205,252,0.25)]"
      />
    </div>
  );
}

function BadgeM() {
  return (
    <div
      className="absolute bg-[#000000] bottom-[54px] box-border content-stretch flex flex-row gap-[7px] items-center justify-start px-3.5 py-2 rounded-[50px] translate-x-[-50%]"
      data-name="Badge/M"
      style={{ left: "calc(50% - 0.5px)" }}
    >
      <div
        aria-hidden="true"
        className="absolute border border-[rgba(255,255,255,0.5)] border-solid inset-0 pointer-events-none rounded-[50px]"
      />
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[16px] text-left text-nowrap tracking-[-0.0016px]">
        <p className="adjustLetterSpacing block leading-[26px] whitespace-pre">
          Secure • Professional • Trusted by thousands of companies
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="bg-[#01030f] relative size-full" data-name="Signup page">
      <Frame1 />
      <div
        className="absolute bottom-[72.43%] font-['Poppins:Regular',_sans-serif] leading-[0] not-italic text-[#acdfff] text-[25px] text-center top-[24.44%] tracking-[-0.75px] translate-x-[-50%] w-[681px]"
        style={{ left: "calc(50% + 28.5px)" }}
      >
        <p className="adjustLetterSpacing block leading-[35px]">Your gateway to professional succes</p>
      </div>
      <div
        className="absolute bg-clip-text bg-gradient-to-r bottom-[77.62%] font-['Poppins:Bold',_sans-serif] from-[#92f4ff] leading-[0] not-italic text-[75.458px] text-left to-[#950ff5] top-[15.22%] tracking-[-2.2637px] w-[605px]"
        style={{ WebkitTextFillColor: "transparent", left: "calc(50% - 302px)" }}
      >
        <p className="adjustLetterSpacing block leading-[79.5px]">Company Portal</p>
      </div>
      <BadgeM />
    </div>
  );
}