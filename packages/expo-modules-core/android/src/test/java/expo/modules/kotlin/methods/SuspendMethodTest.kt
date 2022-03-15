package expo.modules.kotlin.methods

import com.facebook.react.bridge.JavaOnlyArray
import com.google.common.truth.Truth
import expo.modules.PromiseMock
import expo.modules.PromiseState
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.async
import kotlinx.coroutines.cancel
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.test.TestScope
import kotlinx.coroutines.test.runTest
import org.junit.Before
import org.junit.Test

@OptIn(ExperimentalCoroutinesApi::class)
class SuspendMethodTest {
  private lateinit var testScope: TestScope

  @Before
  fun setUp() {
    testScope = TestScope()
  }

  @Test
  fun `suspend block should resolve promise on finish`() {
    val suspendMethod = SuspendMethod("test", emptyArray(), lazy { testScope }) {
      delay(2000)
    }
    val promiseMock = PromiseMock()

    suspendMethod.call(JavaOnlyArray(), promiseMock)
    testScope.testScheduler.advanceTimeBy(3000)

    Truth.assertThat(promiseMock.state).isEqualTo(PromiseState.RESOLVED)
  }

  @Test
  fun `suspend block should reject promise when throws`() = runTest {
    val suspendMethod = SuspendMethod("test", emptyArray(), lazy { testScope }) {
      delay(2000)
      throw IllegalStateException()
    }
    val promiseMock = PromiseMock()

    suspendMethod.call(JavaOnlyArray(), promiseMock)
    testScope.testScheduler.advanceTimeBy(3000)

    Truth.assertThat(promiseMock.state).isEqualTo(PromiseState.REJECTED)
  }

  @Test
  fun `suspend block should be cancelable`() {
    val suspendMethod = SuspendMethod("test", emptyArray(), lazy { testScope }) {
      delay(2000)
    }
    val promiseMock = PromiseMock()

    suspendMethod.call(JavaOnlyArray(), promiseMock)
    testScope.testScheduler.advanceTimeBy(1000)
    testScope.cancel()
    Truth.assertThat(promiseMock.state).isEqualTo(PromiseState.NONE)
  }

  @Test
  fun `suspend block should wait for children`() {
    var wasAsyncCalled = false
    var wasLaunchCalled = false

    val suspendMethod = SuspendMethod("test", emptyArray(), lazy { testScope }) {
      val deferred = async {
        delay(1000)
        wasAsyncCalled = true
      }
      launch {
        delay(4000)
        wasLaunchCalled = true
      }
      deferred.await()
      delay(2000)
    }
    val promiseMock = PromiseMock()

    suspendMethod.call(JavaOnlyArray(), promiseMock)
    testScope.testScheduler.advanceTimeBy(3500)

    Truth.assertThat(promiseMock.state).isEqualTo(PromiseState.RESOLVED)
    Truth.assertThat(wasAsyncCalled).isTrue()
    Truth.assertThat(wasLaunchCalled).isFalse()
  }

  @Test
  fun `suspend block should clean whole coroutine hierarchy`() {
    var wasAsyncCalled = false
    var wasLaunchCalled = false

    val suspendMethod = SuspendMethod("test", emptyArray(), lazy { testScope }) {
      val deferred = async {
        delay(1000)
        wasAsyncCalled = true
      }
      launch {
        delay(1000)
        wasLaunchCalled = true
      }
      deferred.await()
      delay(2000)
    }
    val promiseMock = PromiseMock()

    suspendMethod.call(JavaOnlyArray(), promiseMock)
    testScope.testScheduler.advanceTimeBy(500)
    testScope.cancel()
    Truth.assertThat(promiseMock.state).isEqualTo(PromiseState.NONE)
    Truth.assertThat(wasAsyncCalled).isFalse()
    Truth.assertThat(wasLaunchCalled).isFalse()
  }

  @Test
  fun `should handle multiple calls`() {
    val suspendMethod = SuspendMethod("test", emptyArray(), lazy { testScope }) {
      delay(2000)
    }
    val promiseMock1 = PromiseMock()
    val promiseMock2 = PromiseMock()

    suspendMethod.call(JavaOnlyArray(), promiseMock1)
    suspendMethod.call(JavaOnlyArray(), promiseMock2)

    testScope.testScheduler.advanceTimeBy(2500)

    Truth.assertThat(promiseMock1.state).isEqualTo(PromiseState.RESOLVED)
    Truth.assertThat(promiseMock2.state).isEqualTo(PromiseState.RESOLVED)
  }

  @Test
  fun `should not cancel siblings `() {
    val suspendMethod1 = SuspendMethod("test1", emptyArray(), lazy { testScope }) {
      delay(2000)
    }
    val suspendMethod2 = SuspendMethod("test2", emptyArray(), lazy { testScope }) {
      delay(1000)
      throw IllegalStateException()
    }

    val promiseMock1 = PromiseMock()
    val promiseMock2 = PromiseMock()

    suspendMethod1.call(JavaOnlyArray(), promiseMock1)
    suspendMethod2.call(JavaOnlyArray(), promiseMock2)

    testScope.testScheduler.advanceTimeBy(2500)

    Truth.assertThat(promiseMock1.state).isEqualTo(PromiseState.RESOLVED)
    Truth.assertThat(promiseMock2.state).isEqualTo(PromiseState.REJECTED)
  }
}
