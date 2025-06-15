"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, X } from "lucide-react"

interface PlanDetailsModalProps {
  onClose: () => void
}

export function PlanDetailsModal({ onClose }: PlanDetailsModalProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  const plans = [
    {
      name: "Starter",
      price: billingCycle === 'monthly' ? 20 : 200,
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      features: [
        "Sample Text",
        "Sample Text", 
        "Sample Text",
        "Sample Text",
        "Sample Text"
      ],
      buttonText: "Upgrade Current Plan",
      buttonVariant: "outline" as const,
      isCurrent: true
    },
    {
      name: "Base",
      price: billingCycle === 'monthly' ? 50 : 500,
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      features: [
        "Sample Text",
        "Sample Text",
        "Sample Text", 
        "Sample Text",
        "Sample Text"
      ],
      buttonText: "Choose plan",
      buttonVariant: "digigo" as const,
      isCurrent: false
    },
    {
      name: "Pro",
      price: billingCycle === 'monthly' ? 100 : 1000,
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      features: [
        "Sample Text",
        "Sample Text",
        "Sample Text",
        "Sample Text", 
        "Sample Text"
      ],
      buttonText: "Choose plan",
      buttonVariant: "digigo" as const,
      isCurrent: false,
      isPopular: true
    },
    {
      name: "Enterprise",
      price: billingCycle === 'monthly' ? 200 : 2000,
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      features: [
        "Sample Text",
        "Sample Text",
        "Sample Text",
        "Sample Text",
        "Sample Text"
      ],
      buttonText: "Choose plan",
      buttonVariant: "digigo" as const,
      isCurrent: false
    }
  ]

  return (
    <div className="p-8">
      {/* Close Button */}
      <div className="flex justify-end mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-sf-pro font-bold text-black mb-6">
          Plan Details
        </h1>
        
        {/* Billing Toggle */}
        <div className="inline-flex bg-gray-100 rounded-full p-1">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-[#7165e1] text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              billingCycle === 'yearly'
                ? 'bg-[#7165e1] text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan, index) => (
          <Card
            key={plan.name}
            className={`relative rounded-[20px] border-none shadow-sm overflow-hidden ${
              plan.isPopular
                ? 'bg-gradient-to-br from-[#7165e1] to-[#9b59b6] text-white'
                : 'bg-white'
            }`}
          >
            {plan.isPopular && (
              <div className="absolute top-4 right-4">
                <span className="bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">
                  MOST POPULAR
                </span>
              </div>
            )}
            
            <CardContent className="p-6">
              {/* Price */}
              <div className="mb-4">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className={`text-sm ml-1 ${plan.isPopular ? 'text-white/80' : 'text-gray-500'}`}>
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>
              </div>

              {/* Plan Name */}
              <div className="mb-4">
                <h3 className="text-xl font-sf-pro font-bold mb-2 flex items-center gap-2">
                  {plan.name}
                  {plan.isCurrent && (
                    <span className="bg-[#7165e1] text-white text-xs font-medium px-2 py-1 rounded-full">
                      Current Plan
                    </span>
                  )}
                </h3>
                <p className={`text-sm ${plan.isPopular ? 'text-white/80' : 'text-gray-600'}`}>
                  {plan.description}
                </p>
              </div>

              {/* Features */}
              <div className="mb-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className={`w-4 h-4 flex-shrink-0 ${
                        plan.isPopular ? 'text-white' : 'text-green-500'
                      }`} />
                      <span className={`text-sm ${
                        plan.isPopular ? 'text-white' : 'text-gray-700'
                      }`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Button */}
              <Button
                variant={plan.isPopular ? "secondary" : plan.buttonVariant}
                className={`w-full h-12 rounded-xl font-sf-pro font-semibold ${
                  plan.isPopular
                    ? 'bg-white text-[#7165e1] hover:bg-gray-100'
                    : plan.isCurrent
                    ? 'border-[#7165e1] text-[#7165e1] hover:bg-[#7165e1] hover:text-white'
                    : ''
                }`}
              >
                {plan.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}